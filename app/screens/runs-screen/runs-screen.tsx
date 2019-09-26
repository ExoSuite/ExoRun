import * as React from "react"
import { observer, inject } from "mobx-react"
import { FlatList, Picker, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text } from "@components/text"
import { Screen } from "@components/screen"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { Injection, InjectionProps } from "@services/injections"
import autobind from "autobind-decorator"
import { IRun, IUser } from "@services/api"
import { action, observable } from "mobx"
import { ApiResponse } from "apisauce"
import { isEmpty, noop, remove } from "lodash-es"
import * as FilterFunctons from "@utils/filters-functions"
import { SortFields } from "@utils/sort-fields"
import { UserRunFilters } from "@utils/user-run-filters"
import { DarkTheme, Searchbar } from "react-native-paper"
import { translate } from "@i18n/translate"
import moment from "moment"
import { IBoolFunction } from "@types"
import { AppScreens } from "@navigation/navigation-definitions"
import { renderIf } from "@utils/render-if"

export interface IRunsScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

const SEARCH: ViewStyle = {
  backgroundColor: color.backgroundDarkerer,
  width: 350
}

const TITLE: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker,
  paddingLeft: spacing[5],
  flexDirection: "column",
}

const HEADER_PICKER: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  backgroundColor: color.palette.backgroundDarkerer
}

const HEADER_TITLE: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  backgroundColor: color.palette.backgroundDarkerer,
  justifyContent: "flex-end",
  paddingRight: spacing[4]
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
//  margin: spacing[2],
  padding: spacing[2]
}

const ROW: ViewStyle = {
  flexDirection: "row"
}

const TEXT_ALIGN_RIGHT: TextStyle = {
  textAlign: "right",
  flex: 1
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

const filters = {
  "oldest": FilterFunctons.decayValue(SortFields.CREATED_AT),
  "younger": FilterFunctons.ascentValue(SortFields.CREATED_AT)
}

const keyExtractor = (item: IRun, index: number): string => item.id

// tslint:disable-next-line:completed-docs
@inject(Injection.Api)
@observer
export class RunsScreen extends React.Component<IRunsScreenProps> {
  private currentPage: number
  private filterValue: string
  private lastQuery: string
  private maxPage: number
  private onEndReachedCalledDuringMomentum = true
  private routeAPIGetParcours: string
  @observable private runs: IRun[] = []
  // @ts-ignore
  @observable private target = this.props.navigation.getParam("me")
  private targetProfile: IUser = {} as IUser

  @action.bound
  private deleteRun(runToDelete: IRun): void {
    remove(this.runs, (run: IRun) => run.id === runToDelete.id)
  }

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
    if (item !== this.filterValue && !isEmpty(item)) {
      this.filterValue = item

      if (item === "best" || item === "lower" || item === "oldest" || item === "younger") {
        this.runs = this.runs.slice().sort(filters[item]);
      }
    }
  }

  @autobind
  private onRunPressNavigateToDetails(item: IRun, targetProfile: IUser): IBoolFunction {
    return (): boolean => this.props.navigation.navigate(
      AppScreens.RUN_DETAILS,
      {
        item,
        targetProfile,
        deleteRun: this.deleteRun,
        me: this.props.navigation.getParam("me")
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

    const results = await api.get(this.routeAPIGetParcours, queriesParams).catch(onSearchError)
    this.currentPage = results.data.current_page
    if (!neededNextPage) {
      this.maxPage = results.data.last_page
      this.lastQuery = query
      this.runs = results.data.data
    } else {
      this.runs.push(...results.data.data)
    }
    this.onPickerValueChange(this.filterValue)
  }

  // tslint:disable-next-line:no-feature-envy
  @autobind
  private renderRuns({item} : { item: IRun }): React.ReactElement {
    const formattedCreatedAt = moment(item.created_at).format("LLL")

    return (
      <TouchableOpacity
        style={TIME_CONTAINER}
        onPress={this.onRunPressNavigateToDetails(item, this.targetProfile)}
      >
        <View style={ROW}>
          <View style={{marginLeft: spacing[2], justifyContent: "center"}}>
            <Text
              style={{textTransform: "capitalize"}}
              text={item.name}
              preset="userRow"
            />
          </View>
        </View>
        <View style={{...ROW, flex: 1, marginTop: spacing[3]}}>
          <View style={{flex: 2, paddingRight: spacing[3]}}>
            <Text text="description :"/>
            <Text text={item.description} numberOfLines={2}/>
          </View>
          <View style={TEXT_ALIGN_RIGHT}>
            <Text preset="fieldLabel" tx="common.createdAt"/>
            <Text preset="fieldLabel" text={formattedCreatedAt}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  @action
  public async componentDidMount(): Promise<void> {
    const { api } = this.props
    this.routeAPIGetParcours = "user/me/run"

    if (!this.target) {
      // @ts-ignore
      this.target = this.props.navigation.getParam("userProfile")
      this.routeAPIGetParcours = `user/${this.target.id}/run`
      this.targetProfile = this.target
    } else {
      const me = await api.get("user/me/").catch(onSearchError)
      this.targetProfile = {...me.data}
    }
    const result = await api.get(this.routeAPIGetParcours).catch(onSearchError)
    this.runs.push(...result.data.data)
    await this.onUserTypeSearch("*")
  }

  public render(): React.ReactNode {
    const placeholderTx = translate("common.search")

    // @ts-ignore
    // @ts-ignore
    return (
      <Screen style={ROOT} preset="scroll">
        <View style={TITLE}>
    <View style={{flexDirection: "row", backgroundColor: color.palette.backgroundDarkerer}}>
      <View style={HEADER_PICKER}>
            <Text preset="fieldLabel" text="Classer par : " style={{marginTop: spacing[1]}}/>
            <Picker
              onValueChange={this.onPickerValueChange}
              selectedValue={this.filterValue}
              style={{ backgroundColor: "white", width: 100, height: 30 }}
              itemStyle={{ backgroundColor: "white"}}
            >
              <Picker.Item label="plus récent" value={UserRunFilters.YOUNGER}/>
              <Picker.Item label="plus ancien" value={UserRunFilters.OLDEST}/>
            </Picker>
        <View style={HEADER_TITLE}>
          {renderIf.if(this.targetProfile.first_name === undefined)(
              <Text preset="header" text={" "} style={{ alignSelf: "center" }}/>
            ).elseIf(this.props.navigation.getParam("me") === true)(
              <Text preset="header" text={"Mes Parcours"} style={{ alignSelf: "center" }}/>
          ).else(
              <Text
                preset="header"
                text={`Parcours de ${this.targetProfile.first_name} ${this.targetProfile.last_name}`}
                style={{ alignSelf: "center" }}
              />
            ).evaluate()}
          </View>
          </View>
          </View>
          <View style={{flex: 1, flexDirection: "row", backgroundColor: color.backgroundDarkerer}}>
            <Text preset="fieldLabel" text="Filtrer :  " style={{marginTop: spacing[1]}}/>
            <Searchbar
              placeholder={placeholderTx}
              onChangeText={this.onUserTypeSearch}
              style={SEARCH}
              theme={DarkTheme}
            />
          </View>
        </View>
        <FlatList
          data={this.runs}
          keyExtractor={keyExtractor}
          renderItem={this.renderRuns}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
        />
      </Screen>
    )
  }
}
