import * as React from "react"
import { observer, inject } from "mobx-react"
import { FlatList, Picker, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text } from "@components/text"
import { Screen } from "@components/screen"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import moment from "moment"
import { AppScreens } from "@navigation/navigation-definitions"
import autobind from "autobind-decorator"
import { IBoolFunction } from "@types"
import { action, observable } from "mobx"
import { DarkTheme, Searchbar } from "react-native-paper"
import { noop } from "lodash-es"
import { Injection, InjectionProps } from "@services/injections"
import { IUserRun } from "@services/api"
import { ApiResponse } from "apisauce"
import { translate } from "@i18n/translate"
import { SortValues } from "@utils/sort-values"

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

/*
const filters = [
  "filtre" => () => {}
]
*/

// tslint:disable-next-line:no-commented-code no-commented-out-code
//const keyExtractor = (item: IRun, index: number): string => item.id
const keyExtractor = (item: IUserRun, index: number): string => item.id

// tslint:disable-next-line:completed-docs
@inject(Injection.Api)
@observer
export class UserRunsTimesScreen extends React.Component<IRunsTimesScreenProps> {
  private currentPage: number
  private filterValue: string
  private lastQuery: string
  private maxPage: number
  private onEndReachedCalledDuringMomentum = true
  @observable private run: string
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

  // tslint:disable-next-line:no-feature-envy
  @action.bound
  private onPickerValueChange(item: string): void {
    if (item !== this.filterValue && item !== null) {
      this.filterValue = item
      switch (item) {
        case "best": {
          this.userRuns = this.userRuns.slice().sort((prev: IUserRun, next: IUserRun) => {
            if (prev.final_time > next.final_time) {
              return SortValues.DECAY
            }
            if (prev.final_time < next.final_time) {
              return SortValues.ASCENT
            }

            return SortValues.NONE
          });
          break;
        }
        case "lower": {
          this.userRuns = this.userRuns.slice().sort((prev: IUserRun, next: IUserRun) => {
            if (prev.final_time < next.final_time) {
              return SortValues.DECAY
            }
            if (prev.final_time > next.final_time) {
              return SortValues.ASCENT
            }

            return SortValues.NONE
          });
          break;
        }
        case "oldest": {
          this.userRuns = this.userRuns.slice().sort((prev: IUserRun, next: IUserRun) => {
            if (prev.created_at < next.created_at) {
              return SortValues.DECAY
            }
            if (prev.created_at > next.created_at) {
              return SortValues.ASCENT
            }

            return SortValues.NONE
          });
          break;
        }
        case "younger": {
          this.userRuns = this.userRuns.slice().sort((prev: IUserRun, next: IUserRun) => {
            if (prev.created_at > next.created_at) {
              return SortValues.DECAY
            }
            if (prev.created_at < next.created_at) {
              return SortValues.ASCENT
            }

            return SortValues.NONE
          });
          break;
        }
        default: {
          return
        }
      }
    }
  }

  @autobind
  private onTimePressNavigateToDetails(item: IUserRun, run_name: string): IBoolFunction {

    return (): boolean => this.props.navigation.navigate(
      AppScreens.RUN_TIMES_DETAILS,
      {
        item,
        run_name
      }
    )
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

    const results = await api.get("user/me/run/50d46910-afa6-11e9-84e8-31e5da852473/user_run", queriesParams).catch(onSearchError)
    this.currentPage = results.data.current_page
    if (!neededNextPage) {
      this.maxPage = results.data.last_page
      this.lastQuery = query
      this.userRuns = results.data.data
    } else {
      this.userRuns.push(...results.data.data)
    }
    this.onPickerValueChange(this.filterValue)
  }

  // tslint:disable-next-line:no-feature-envy
  @autobind
  private renderTimes({item}: { item: IUserRun }): React.ReactElement {
    const formattedCreatedAt = moment(item.created_at).format("LLL");
    const time = new Date(
      0,
      0,
      0,
      (item.final_time / 3600),
      (item.final_time / 60) % 60,
      item.final_time % 60
    );

    const formattedTime = `${time.getHours().toString()} h ${time.getMinutes().toString()} min ${time.getSeconds().toString()} sec`

    return (
      <TouchableOpacity
        style={TIME_CONTAINER}
        onPress={this.onTimePressNavigateToDetails(item, this.run)}
      >
        <View style={ROW}>
          <View style={{marginLeft: spacing[2], justifyContent: "center"}}>
            <Text
              style={{textTransform: "capitalize"}}
              text={formattedTime}
              preset="userRow"
            />
          </View>
        </View>
        <View style={{...ROW, flex: 1, marginTop: spacing[3]}}>
          <View>
            <Text preset="fieldLabel" text="Couru le :"/>
            <Text preset="fieldLabel" text={formattedCreatedAt}/>
          </View>
        </View>
      </TouchableOpacity>

    )
  }

  @action
  public async componentDidMount(): Promise<void> {
    const { api } = this.props

    // tslint:disable-next-line:max-line-length no-suspicious-comment
    const results = await api.get("user/me/run/50d46910-afa6-11e9-84e8-31e5da852473/user_run").catch(onSearchError) //TODO:Changer valeur par defaut
    this.userRuns.push(...results.data.data)
    await this.onUserTypeSearch("*")
    // tslint:disable-next-line:no-suspicious-comment max-line-length
    const run_results = await api.get(`user/me/run/50d46910-afa6-11e9-84e8-31e5da852473`).catch(onSearchError)  //TODO:Changer valeur par defaut
    this.run = run_results.data.name
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
            <Text preset="fieldLabel" text="Classer par : " style={{marginTop: spacing[1]}}/>
            <Picker
              onValueChange={this.onPickerValueChange}
              selectedValue={this.filterValue}
              style={{ backgroundColor: "white", width: 100, height: 30}}
            >
              <Picker.Item label="Plus récent" value="younger"/>
              <Picker.Item label="Plus ancien" value="oldest"/>
              <Picker.Item label="Meilleurs temps" value="best"/>
              <Picker.Item label="Plus petits temps" value="lower"/>
            </Picker>
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
