import { createStackNavigator } from "react-navigation-stack"
import { AppScreens } from "@navigation/navigation-definitions"
import { LogoHeader } from "@components/logo-header"
import { color } from "@theme"
import { headerShadow } from "@utils/shadows"
import { AppBottomTabNavigator } from "@navigation/app-bottom-tab-navigator"
import { AvatarLeftHeader } from "@navigation/components/avatar-left-header"
import { UserProfileScreen } from "@screens/user-profile-screen"
import { ApplicationSettingsScreen } from "@screens/application-settings-screen"
import { EditMyProfileScreen } from "@screens/edit-my-profile-screen"
import { NewGroupScreen } from "@screens/new-group-screen"
import { FollowScreen } from "@screens/follow-screen"
import { ModalPostScreen } from "@screens/modal-post-screen"
import { ChooseUsersNewGroupScreen } from "@screens/choose-users-new-group-screen"
import { ChatScreen } from "@screens/chat-screen"
import { AugmentedRealityNavigator } from "@screens/augmented-reality-screen"
import { MapScreen } from "@screens/map-screen"
import { IosStyle } from "@navigation/transitions/ios-style"
import { UserRunsTimesScreen } from "@screens/runs-times-screen"
import { UserRunsDetailsScreen } from "@screens/user-runs-details-screen"
import { RunsScreen } from "@screens/runs-screen"
import { RunDetailsScreen } from "@screens/run-details-screen"
import { FollowersListScreen } from "@screens/followers-list-screen"
import { FollowsListScreen } from "@screens/follows-list-screen"
import { FriendshipsListScreen } from "@screens/friendships-list-screen"
import { PendingRequestsScreen } from "@screens/pending-requests-screen"
import { CreateRunScreen } from "@screens/create-run-screen/create-run-screen"
import { CheckpointsNewRunScreen } from "@screens/create-run-screen/checkpoints-new-run-screen"

export const AppStackNavigatorImpl = createStackNavigator({
  [AppScreens.HOME]: AppBottomTabNavigator,
  [AppScreens.USER_PROFILE]: UserProfileScreen,
  [AppScreens.APP_SETTINGS]: ApplicationSettingsScreen,
  [AppScreens.EDIT_MY_PROFILE]: EditMyProfileScreen,
  [AppScreens.FOLLOW]: FollowScreen,
  [AppScreens.CHAT]: ChatScreen,
  [AppScreens.AUGMENTED_REALITY]: AugmentedRealityNavigator,
  [AppScreens.MAP]: MapScreen,
  [AppScreens.RUNS_TIMES]: UserRunsTimesScreen,
  [AppScreens.RUN_TIMES_DETAILS]: UserRunsDetailsScreen,
  [AppScreens.RUNS]: RunsScreen,
  [AppScreens.RUN_DETAILS]: RunDetailsScreen,
  [AppScreens.GET_FOLLOWERS]: FollowersListScreen,
  [AppScreens.GET_FOLLOWS]: FollowsListScreen,
  [AppScreens.GET_FRIENDS]: FriendshipsListScreen,
  [AppScreens.PENDING_REQUESTS]: PendingRequestsScreen,
}, {
  // @ts-ignore
  defaultNavigationOptions: {
    headerLeft: AvatarLeftHeader,
    headerTitle: LogoHeader,
    headerStyle: {
      backgroundColor: color.backgroundDarkerer,
      borderBottomWidth: 0,
      ...headerShadow
    }
  },
  headerLayoutPreset: "center",
  initialRouteName: AppScreens.HOME,
  transitionConfig: IosStyle
})

export const AppStackNavigator = createStackNavigator({
  [AppScreens.HOME]: {
    screen: AppStackNavigatorImpl,
    navigationOptions: {
      header: null
    }
  },
  [AppScreens.NEW_GROUP]: NewGroupScreen,
  [AppScreens.NEW_POST]: ModalPostScreen,
  [AppScreens.CHOOSE_USERS_FOR_NEW_GROUP]: ChooseUsersNewGroupScreen,
  [AppScreens.CREATE_NEW_RUN]: CreateRunScreen,
  [AppScreens.CHECKPOINTS_FOR_NEW_RUN]: CheckpointsNewRunScreen
}, {
  mode: "modal",
  // @ts-ignore
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: color.backgroundDarkerer,
      borderBottomWidth: 0,
      ...headerShadow
    }
  }
})
