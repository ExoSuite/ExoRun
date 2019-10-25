import * as React from "react"
import { inject, observer } from "mobx-react"
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
import { isEmpty, noop, remove } from "lodash-es"
import { Injection, InjectionProps } from "@services/injections"
import { IUser, IUserRun } from "@services/api"
import { ApiResponse } from "apisauce"
import { SortFields } from "@utils/sort-fields"
import { UserRunFilters } from "@utils/user-run-filters"
import * as FilterFunctons from "@utils/filters-functions"
import { renderIf } from "@utils/render-if"

export interface IRunsTimesScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

const HEADER_PICKER: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  backgroundColor: color.palette.backgroundDarkerer
}

const HEADER_TITLE: ViewStyle = {
  flex: 2,
  flexDirection: "row",
  backgroundColor: color.palette.backgroundDarkerer,
  justifyContent: "flex-end",
  paddingRight: spacing[4]
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
  "best": FilterFunctons.ascentValue(SortFields.FINAL_TIME),
  "lower": FilterFunctons.decayValue(SortFields.FINAL_TIME),
  "oldest": FilterFunctons.decayValue(SortFields.CREATED_AT),
  "younger": FilterFunctons.ascentValue(SortFields.CREATED_AT)
}

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
  // @ts-ignore
  @observable private readonly runId: string = this.props.navigation.getParam("run_id")
  // @ts-ignore
  private readonly targetProfile: IUser = this.props.navigation.getParam("targetProfile")
  @observable private userRuns: IUserRun[] = []

  @action.bound
  private deleteUserRun(userRunToDelete: IUserRun): void {
    remove(this.userRuns, (userRun: IUserRun) => userRun.id === userRunToDelete.id)
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
        this.userRuns = this.userRuns.slice().sort(filters[item]);
      }
    }
  }

  @autobind
  private onTimePressNavigateToDetails(item: IUserRun): IBoolFunction {

    if (item.final_time !== 0) {
      return (): boolean => this.props.navigation.navigate(
        AppScreens.RUN_TIMES_DETAILS,
        {
          item,
          deleteUserRun: this.deleteUserRun
        }
      )
    }
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

    const results = await api.get(`user/${this.targetProfile.id}/run/${this.runId}/user_run`, queriesParams).catch(onSearchError)
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
        onPress={this.onTimePressNavigateToDetails(item)}
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

    const results = await api.get(`user/${this.targetProfile.id}/run/${this.runId}/user_run`).catch(onSearchError)
    this.userRuns.push(...results.data.data)
    await this.onUserTypeSearch("*")
  }

  public render (): React.ReactNode {

    return (
      <Screen style={ROOT} preset="fixed">
        <View style={TITLE}>
          <View style={{flex: 1, backgroundColor: color.palette.backgroundDarkerer, flexDirection: "row"}}>
            <View style={HEADER_PICKER}>
            <Text preset="fieldLabel" text="Classer par : " style={{marginTop: spacing[1]}}/>
            <Picker
              onValueChange={this.onPickerValueChange}
              selectedValue={this.filterValue}
              style={{ backgroundColor: "white", width: 100, height: 30}}
              itemStyle={{ backgroundColor: "white" }}
            >
              <Picker.Item label="Plus récent" value={UserRunFilters.YOUNGER}/>
              <Picker.Item label="Plus ancien" value={UserRunFilters.OLDEST}/>
              <Picker.Item label="Meilleurs temps" value={UserRunFilters.BEST}/>
              <Picker.Item label="Plus petits temps" value={UserRunFilters.LOWER}/>
            </Picker>
            </View>
            <View style={HEADER_TITLE}>
              {renderIf.if(this.props.navigation.getParam("me") === true)(
                <Text
                  text={`Mes temps de courses`}
                  style={{ alignSelf: "center", fontWeight: "bold", fontSize: 20}}
                />
              ).else(
                <Text
                  text={`Temps de : ${this.targetProfile.first_name} ${this.targetProfile.last_name}`}
                  style={{ alignSelf: "center", fontWeight: "bold", fontSize: 20}}
                />
              ).evaluate()}
          </View>
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
