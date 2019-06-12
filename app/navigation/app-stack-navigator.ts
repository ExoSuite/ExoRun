import { createStackNavigator } from "react-navigation"
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
import { RunScreen } from "@screens/run-screen"
import { AugmentedRealityNavigator } from "@screens/augmented-reality-screen"
import { MapScreen } from "@screens/map-screen"

export const AppStackNavigatorImpl = createStackNavigator({
  [AppScreens.HOME]: AppBottomTabNavigator,
  [AppScreens.USER_PROFILE]: UserProfileScreen,
  [AppScreens.APP_SETTINGS]: ApplicationSettingsScreen,
  [AppScreens.EDIT_MY_PROFILE]: EditMyProfileScreen,
  [AppScreens.FOLLOW]: FollowScreen,
  [AppScreens.CHAT]: ChatScreen,
  [AppScreens.AUGMENTED_REALITY]: AugmentedRealityNavigator,
  [AppScreens.MAP]: MapScreen
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
  initialRouteName: AppScreens.HOME
})

export const AppStackNavigator = createStackNavigator({
  [AppScreens.HOME]: {
    screen: AppStackNavigatorImpl,
    navigationOptions: {
      header: null
    },
  },
  [AppScreens.NEW_GROUP]: NewGroupScreen,
  [AppScreens.NEW_POST]: ModalPostScreen,
  [AppScreens.CHOOSE_USERS_FOR_NEW_GROUP]: ChooseUsersNewGroupScreen
}, {
  mode: "modal",
  // @ts-ignore
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: color.backgroundDarkerer,
      borderBottomWidth: 0,
      ...headerShadow
    }
  },
})
