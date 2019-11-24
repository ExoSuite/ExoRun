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
import moment from "moment"
import { IBoolFunction } from "@types"
import { AppScreens } from "@navigation/navigation-definitions"
import { renderIf } from "@utils/render-if"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { NavigationStackProp } from "react-navigation-stack/src/types"
import { IVoidFunction } from "@custom-types/functions"
import { Button } from "@components/button"
import { translate } from "@i18n/translate"
import { Menu } from "react-native-paper"
import { RunType } from "@screens/create-run-screen/run-type"

export interface IRunsScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1
}

const TITLE: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker,
  padding: spacing[5]
}

const RUN_CONTAINER: ViewStyle = {
  backgroundColor: color.backgroundDarkerer,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  margin: spacing[3],
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
  private filterValue: string = UserRunFilters.YOUNGER
  private focusListener: any

  @observable private isOptionOpened = false
  private lastQuery: string
  private maxPage: number
  private onEndReachedCalledDuringMomentum = true
  private routeAPIGetParcours: string
  @observable private runs: IRun[] = []
  // @ts-ignore
  @observable private target = this.props.navigation.getParam("me") ?? true
  private static targetProfile: IUser = {} as IUser

  private static AddNewRun(navigation: NavigationStackProp): IVoidFunction {
    return (): any => navigation.navigate(AppScreens.CREATE_NEW_RUN)
  }

  // tslint:disable-next-line: typedef
  public static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity style={{marginRight: spacing[2]}} onPress={RunsScreen.AddNewRun(navigation)}>
        <FontawesomeIcon name="layer-plus" size={32} color={color.palette.white} />
      </TouchableOpacity>
    )
  })

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
        this.toggleOptions()
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
        style={RUN_CONTAINER}
        onPress={this.onRunPressNavigateToDetails(item, RunsScreen.targetProfile)}
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

  @action.bound
  private toggleOptions(): void {
    this.isOptionOpened = !this.isOptionOpened
  }

  @action
  public async componentDidMount(): Promise<void> {
    const { api } = this.props
    this.routeAPIGetParcours = "user/me/run"

    if (!this.target) {
      // @ts-ignore
      this.target = this.props.navigation.getParam("userProfile")
      this.routeAPIGetParcours = `user/${this.target.id}/run`
      RunsScreen.targetProfile = this.target
    } else {
      const me = await api.get("user/me/").catch(onSearchError)
      RunsScreen.targetProfile = {...me.data}
    }
    const result = await api.get(this.routeAPIGetParcours).catch(onSearchError)
    this.runs.push(...result.data.data)
    await this.onUserTypeSearch("*")

    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.onUserTypeSearch("*").catch(noop)
    });
  }

  public componentWillUnmount(): void {
    // Remove the event listener
    this.focusListener.remove();
  }

  public render(): React.ReactNode {

    // tslint:disable: no-void-expression
    const onYoungerSelected = (): void => this.onPickerValueChange(UserRunFilters.YOUNGER)
    const onOldestSelected = (): void => this.onPickerValueChange(UserRunFilters.OLDEST)
    const currentFilterTranslated = translate(`run.${this.filterValue}`)

    return (
      <View style={ROOT}>
        <View style={TITLE}>
          <Menu
            visible={this.isOptionOpened}
            onDismiss={this.toggleOptions}
            anchor={
              (
                <Button
                  preset="neutral"
                  textPreset="primaryBoldLarge"
                  text={`${translate("run.filter-by")} ${currentFilterTranslated}`}
                  onPress={this.toggleOptions}
                />
              )
            }
            contentStyle={{ backgroundColor: color.backgroundDarkerer }}
          >
            <Menu.Item
              onPress={onYoungerSelected}
              title={<Text style={{ textTransform: "capitalize" }} text={translate(`run.${UserRunFilters.YOUNGER}`)}/>}
            />
            <Menu.Item
              onPress={onOldestSelected}
              title={<Text style={{ textTransform: "capitalize" }} text={translate(`run.${UserRunFilters.OLDEST}`)}/>}
            />
          </Menu>
        </View>
        <FlatList
          data={this.runs}
          keyExtractor={keyExtractor}
          renderItem={this.renderRuns}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
        />
      </View>
    )
  }
}
