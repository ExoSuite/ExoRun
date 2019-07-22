import * as React from "react"
import { observer, inject } from "mobx-react"
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text } from "@components/text"
import { Screen } from "@components/screen"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import moment from "moment"
import { AppScreens } from "@navigation/navigation-definitions"
import autobind from "autobind-decorator"
// @ts-ignore
import { IBoolFunction } from "@types/FunctionTypes"
import { action, observable } from "mobx"
import { Switch } from "@components/switch"
import { Toggle } from "react-powerplug"
import { DarkTheme, Searchbar } from "react-native-paper"
import { noop } from "lodash-es"
import { Injection, InjectionProps } from "@services/injections"
import { IUserRun } from "@services/api"
import { ApiResponse } from "apisauce"
import { translate } from "@i18n/translate"
// @ts-ignore
// tslint:disable-next-line:no-commented-code no-commented-out-code

export interface IRunsTimesScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

const TITLE: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker,
  marginLeft: spacing[5],
  margin: spacing[2],
  flexDirection: "row",
}

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1
}

const TIME_CONTAINER: ViewStyle = {
  backgroundColor: color.backgroundDarkerer,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  margin: spacing[2],
  padding: spacing[2]
}

const TEXT_ALIGN_RIGHT: TextStyle = {
  textAlign: "right"
}

const ROW: ViewStyle = {
  flexDirection: "row"
}

const SEARCH: ViewStyle = {
  backgroundColor: color.backgroundDarkerer
}

// @ts-ignore
const onSearchError = (): ApiResponse<any> => (
  {
    data: {
      data: [],
      current_page: Number.MAX_SAFE_INTEGER
    }
  }
)

// tslint:disable-next-line:no-commented-code no-commented-out-code
//const keyExtractor = (item: IRun, index: number): string => item.id
const keyExtractor = (item: IUserRun, index: number): string => item.id

// tslint:disable-next-line:completed-docs
@inject(Injection.Api)
@observer
export class UserRunsTimesScreen extends React.Component<IRunsTimesScreenProps> {
  private currentPage: number
  private lastQuery: string
  private maxPage: number
  private onEndReachedCalledDuringMomentum = true
  @observable private userRuns: IUserRun[] = []

/*
  @action.bound
  private assignRunFilter(run: string): void {
    this.run = run
  }
*/

  @autobind
  private onEndReached(): void {
    if (this.currentPage < this.maxPage && !this.onEndReachedCalledDuringMomentum) {
      this.currentPage += 1
      this.onUserTypeSearch(this.lastQuery, true).catch(noop)
    }
  }

  @autobind
  private onMomentumScrollBegin(): void {
    this.onEndReachedCalledDuringMomentum = false
  }

  @action.bound
  // tslint:disable-next-line:typedef
  private async onUserTypeSearch(query: string, neededNextPage = false): Promise<void> {
    const { api } = this.props

    if (!query) {
      // tslint:disable-next-line:no-parameter-reassignment
      query = "*"
    }

    const queriesParams: { page?: number, text: string } = {
      text: query
    }

    if (neededNextPage) {
      queriesParams.page = this.currentPage
    }

    const results = await api.get("maRoute", queriesParams).catch(onSearchError)
    this.currentPage = results.data.current_page
    if (!neededNextPage) {
      this.maxPage = results.data.last_page
      this.lastQuery = query
      this.userRuns = results.data.data
    } else {
      this.userRuns.push(...results.data.data)
    }
  }

/*
  @autobind
  private filterDatas(runName: string): void {
    this.testDatas.forEach(function (elem) {
      if (elem.run.name === runName) {

      }
    })
  }
*/

  @autobind
  private onTimePressNavigateToDetails(item: any): IBoolFunction {
    return (): boolean => this.props.navigation.navigate(
      AppScreens.CHAT,
      {
        item
      }
    )
  }

  // tslint:disable-next-line:no-feature-envy
  @autobind
  private renderTimes({item}: { item: any }): React.ReactElement {
    const formattedCreatedAt = moment(item.created_at).format("LLL");
    const time = new Date(
      0,
      0,
      0,
      (item.time / 3600),
      (item.time / 60) % 60,
      item.time % 60
    );
    // tslint:disable-next-line:max-line-length prefer-template
    const formattedTime = time.getHours().toString()
      + " h " + time.getMinutes().toString() + " min " + time.getSeconds().toString() + " sec";

    return (
      <TouchableOpacity
        style={TIME_CONTAINER}
        onPress={this.onTimePressNavigateToDetails(item)}
      >
        <View style={ROW}>
          <View style={{marginLeft: spacing[2], justifyContent: "center"}}>
            <Text
              style={{textTransform: "capitalize"}}
              text={item.run.name}
              preset="userRow"
            />
          </View>
        </View>
        <View style={{...ROW, flex: 1, marginTop: spacing[3]}}>
          <View>
            <Text preset="fieldLabel" text="Temps total :"/>
            <Text preset="fieldLabel" text={formattedTime}/>
          </View>
          <View style={{alignSelf: "flex-end", flex: 1}}>
            <Text preset="fieldLabel" tx="common.createdAt" style={TEXT_ALIGN_RIGHT}/>
            <Text preset="fieldLabel" text={formattedCreatedAt} style={TEXT_ALIGN_RIGHT}/>
          </View>
        </View>
      </TouchableOpacity>

    )
  }

  public render (): React.ReactNode {
    const placeholderTx = translate("common.search")

    return (
      <Screen style={ROOT} preset="fixed">
        <View style={TITLE}>
          <View style={{flex: 1, backgroundColor: color.palette.backgroundDarkerer, flexDirection: "row", alignContent: "center"}}>
            <Text preset="fieldLabel" text="Filtrer :  " style={{marginTop: spacing[1]}}/>
            <Searchbar
              placeholder={placeholderTx}
              onChangeText={this.onUserTypeSearch}
              style={SEARCH}
              theme={DarkTheme}
            />
          </View>
          <View style={{flex: 1, backgroundColor: color.palette.backgroundDarkerer, flexDirection: "row"}}>
            <Text preset="fieldLabel" text="Meilleurs temps : " style={{marginTop: spacing[1]}}/>
            <Toggle initial={false}>
              {({ on, toggle }) => (
                <View style={{alignItems: "flex-end"}}>
                  <Switch
                    value={on}
                    onToggle={toggle}
                  />
                </View>
              )}
            </Toggle>
          </View>
        </View>

        <FlatList
          data={this.userRuns}
          keyExtractor={keyExtractor}
          renderItem={this.renderTimes}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
        />

      </Screen>
    )
  }
}
