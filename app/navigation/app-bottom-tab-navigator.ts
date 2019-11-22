import { AppScreens } from "@navigation/navigation-definitions"
import { TabBarIcon } from "@navigation/components/tab-bar-icon"
import { NotificationsScreen } from "@screens/notifications-screen"
import { GroupScreen } from "@screens/group-screen"
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs"
import { footerShadow } from "@utils/shadows"
import { color } from "@theme"
import { HomeNavigator } from "@navigation/home-navigator"
import { SearchScreen } from "@screens/search-screen"
import { getActiveChildNavigationOptions } from "react-navigation"
import { RunsScreen } from "@screens/runs-screen"

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
    [AppScreens.RUN]: {
      screen: RunsScreen,
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
    },
    [AppScreens.SEARCH]: {
      screen: SearchScreen,
      navigationOptions: {
        tabBarIcon: TabBarIcon({ name: "search", size: tabBarIconSize }),
        tabBarColor: "#474f89"
      }
    }
  }, {
    shifting: true,
    barStyle: {
      ...footerShadow,
      backgroundColor: color.backgroundDarkerer,
      borderBottomWidth: 0
    },
    labeled: false,
    // tslint:disable-next-line: typedef
    navigationOptions: ({ navigation, screenProps }) => ({
      // you can put fallback values before here, eg: a default tabBarLabel
      ...getActiveChildNavigationOptions(navigation, screenProps)
      // put other navigationOptions that you don't want the active child to
      // be able to override here!
    })
  }
)
