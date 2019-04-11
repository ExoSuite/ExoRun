import { createStackNavigator } from "react-navigation"
import { AppScreens } from "@navigation/navigation-definitions"
import { LogoHeader } from "@components/logo-header"
import { color } from "@theme"
import { headerShadow } from "@utils/shadows"
import { AppBottomTabNavigator } from "@navigation/app-bottom-tab-navigator"
import { AvatarLeftHeader } from "@navigation/components/avatar-left-header"
import { UserProfileScreen } from "@screens/user-profile-screen"
import { ApplicationSettingsScreen } from "@screens/application-settings-screen"

export const AppStackNavigator = createStackNavigator({
  [AppScreens.HOME]: AppBottomTabNavigator,
  [AppScreens.PERSONAL_PROFILE]: UserProfileScreen,
  [AppScreens.APP_SETTINGS]: ApplicationSettingsScreen
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
  headerLayoutPreset: "center"
})
