import * as React from "react"
import { inject, observer } from "mobx-react"
import { FlatList, TouchableOpacity, View, ViewStyle } from "react-native"
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
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { Menu } from "react-native-paper"
import { Button } from "@components/button"
import { translate } from "@i18n/translate"

export interface IRunsTimesScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

const HEADER_PICKER: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  backgroundColor: color.palette.backgroundDarkerer,
}

const TITLE: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker,
  marginLeft: spacing[5],
  margin: spacing[2],
  flexDirection: "row",
}

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
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
  padding: spacing[2],
}

const ROW: ViewStyle = {
  flexDirection: "row",
}

// @ts-ignore
const onSearchError = (): ApiResponse<any> => (
  {
    data: {
      data: [],
      current_page: Number.MAX_SAFE_INTEGER,
    },
  }
)

const filters = {
  "best": FilterFunctons.ascentValue(SortFields.FINAL_TIME),
  "lower": FilterFunctons.decayValue(SortFields.FINAL_TIME),
  "oldest": FilterFunctons.decayValue(SortFields.CREATED_AT),
  "younger": FilterFunctons.ascentValue(SortFields.CREATED_AT),
}

// tslint:disable-next-line:no-commented-code no-commented-out-code
//const keyExtractor = (item: IRun, index: number): string => item.id
const keyExtractor = (item: IUserRun, index: number): string => item.id

// tslint:disable-next-line:completed-docs
@inject(Injection.Api)
@observer
export class UserRunsTimesScreen extends React.Component<IRunsTimesScreenProps> {
  private currentPage: number
  private filterValue: string = UserRunFilters.YOUNGER

  @observable private isOptionOpened = false
  private lastQuery: string
  private maxPage: number
  private onEndReachedCalledDuringMomentum = true
  // @ts-ignore
  @observable private readonly runId: string = this.props.navigation.getParam("run_id")
  @observable private userRuns: IUserRun[] = []
  // @ts-ignore
  private static targetProfile: IUser = {}

  // tslint:disable-next-line: typedef
  public static navigationOptions = ({ navigation }) => ({
    headerLeft: NavigationBackButtonWithNestedStackNavigator(),
    headerTitle: renderIf.if(navigation.getParam("me") === true)(
      (
        <Text
          tx="common.my-run-time"
          style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}
        />
      )
    ).else(
      (
        <Text
          text={`${translate("common.other-run-time")} ${UserRunsTimesScreen.targetProfile.first_name} ${UserRunsTimesScreen.targetProfile.last_name}`}
          style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}
        />
      )
    ).evaluate()
  })

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
        this.userRuns = this.userRuns.slice().sort(filters[item])
        this.toggleOptions()
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
          deleteUserRun: this.deleteUserRun,
        },
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
      text: query,
    }

    if (neededNextPage) {
      queriesParams.page = this.currentPage
    }

    const results = await api.get(
      `user/${UserRunsTimesScreen.targetProfile.id}/run/${this.runId}/user_run`, queriesParams).catch(onSearchError)
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
  private renderTimes({ item }: { item: IUserRun }): React.ReactElement {
    const formattedCreatedAt = moment(item.created_at).format("LLL")
    const time = new Date(
      0,
      0,
      0,
      (item.final_time / 3600),
      (item.final_time / 60) % 60,
      item.final_time % 60,
    )

    const formattedTime = `${time.getHours().toString()} h ${time.getMinutes().toString()} min ${time.getSeconds().toString()} sec`

    return (
      <>
      {
        item.final_time > 0 && (
          <TouchableOpacity
            style={TIME_CONTAINER}
            onPress={this.onTimePressNavigateToDetails(item)}
          >
          <View style={ROW}>
            <View style={{ marginLeft: spacing[2], justifyContent: "center" }}>
              <Text
                style={{ textTransform: "capitalize" }}
                text={formattedTime}
                preset="userRow"
              />
            </View>
          </View>
          <View style={{ ...ROW, flex: 1, marginTop: spacing[3] }}>
            <View>
              <Text preset="fieldLabel" tx="common.createdAt"/>
              <Text preset="fieldLabel" text={formattedCreatedAt}/>
            </View>
          </View>
          </TouchableOpacity>
        )
      }
      </>
    )
  }

  @action.bound
  private toggleOptions(): void {
    this.isOptionOpened = !this.isOptionOpened
  }

  @action
  public async componentDidMount(): Promise<void> {
    const { api } = this.props

    UserRunsTimesScreen.targetProfile = this.props.navigation.getParam("targetProfile")
    const results = await api.get(`user/${UserRunsTimesScreen.targetProfile.id}/run/${this.runId}/user_run`).catch(onSearchError)
    this.userRuns.push(...results.data.data)
    await this.onUserTypeSearch("*")
  }

  public render(): React.ReactNode {

    // tslint:disable: no-void-expression
    const onYoungerSelected = (): void => this.onPickerValueChange(UserRunFilters.YOUNGER)
    const onOldestSelected = (): void => this.onPickerValueChange(UserRunFilters.OLDEST)
    const onBestSelected = (): void => this.onPickerValueChange(UserRunFilters.BEST)
    const onLowerSelected = (): void => this.onPickerValueChange(UserRunFilters.LOWER)
    const currentFilterTranslated = translate(`run.${this.filterValue}`)

    return (
      <Screen style={ROOT} preset="fixed">
        <View style={TITLE}>
          <View style={{ flex: 1, backgroundColor: color.palette.backgroundDarkerer, flexDirection: "row" }}>
            <View style={HEADER_PICKER}>
              <Menu
                visible={this.isOptionOpened}
                onDismiss={this.toggleOptions}
                anchor={
                  (
                    <Button
                      preset="neutral"
                      textPreset="primaryBoldLarge"
                      text={`${translate("run.sort")} ${currentFilterTranslated}`}
                      onPress={this.toggleOptions}
                    />
                  )
                }
                contentStyle={{ backgroundColor: color.backgroundDarkerer }}
              >
                <Menu.Item
                  onPress={onYoungerSelected}
                  title={(
                    <Text
                      style={{ textTransform: "capitalize" }}
                      text={translate(`run.${UserRunFilters.YOUNGER}`)}
                    />
                   )}
                />
                <Menu.Item
                  onPress={onOldestSelected}
                  title={(
                    <Text
                      style={{ textTransform: "capitalize" }}
                      text={translate(`run.${UserRunFilters.OLDEST}`)}
                    />
                  )}
                />

                <Menu.Item
                  onPress={onBestSelected}
                  title={<Text style={{ textTransform: "capitalize" }} text={translate(`run.${UserRunFilters.BEST}`)}/>}
                />

                <Menu.Item
                  onPress={onLowerSelected}
                  title={(
                    <Text
                      style={{ textTransform: "capitalize" }}
                      text={translate(`run.${UserRunFilters.LOWER}`)}
                    />
                  )}
                />

              </Menu>
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
