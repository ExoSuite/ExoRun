import { AppScreens } from "@navigation/navigation-definitions"
import { TabBarIcon } from "@navigation/components/tab-bar-icon"
import { NotificationsScreen } from "@screens/notifications-screen"
import { AugmentedRealityNavigator } from "@screens/augmented-reality-screen"
import { GroupScreen } from "@screens/group-screen"
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs"
import { footerShadow } from "@utils/shadows"
import { color } from "@theme"
import { HomeNavigator } from "@navigation/home-navigator"

const tabBarIconSize = 20

export const AppBottomTabNavigator = createMaterialBottomTabNavigator(
  {
    [AppScreens.HOME]: {
      screen: HomeNavigator,
      navigationOptions: {
        tabBarIcon: TabBarIcon({ name: "poll-people", size: tabBarIconSize }),
        tabBarColor: color.backgroundDarkerer
      }
    },
    [AppScreens.NOTIFICATIONS]: {
      screen: NotificationsScreen,
      navigationOptions: {
        tabBarIcon: TabBarIcon({ name: "bell", size: tabBarIconSize }),
        tabBarColor: "#2b872b"
      }
    },

    [AppScreens.AUGMENTED_REALITY]: {
      screen: AugmentedRealityNavigator,
      navigationOptions: {
        tabBarIcon: TabBarIcon({ name: "running", size: 22 }),
        tabBarColor: "#892943"
      }
    },
    [AppScreens.GROUPS]: {
      screen: GroupScreen,
      navigationOptions: {
        tabBarIcon: TabBarIcon({ name: "user-friends", size: tabBarIconSize }),
        tabBarColor: "#0087c7"
      }
    }
  }, {
    shifting: true,
    barStyle: {
      ...footerShadow,
      backgroundColor: color.backgroundDarkerer,
      borderBottomWidth: 0
    },
    labeled: false
  }
)
