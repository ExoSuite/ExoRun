import { createStackNavigator } from "react-navigation-stack"
import { AppScreens } from "@navigation/navigation-definitions"
import { HomeScreen } from "@screens/home-screen"

export const HomeNavigator = createStackNavigator({
  [AppScreens.HOME]: { screen: HomeScreen }
}, {
  defaultNavigationOptions: {
    header: null
  }
})
