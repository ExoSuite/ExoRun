import { AppNavigator } from "@navigation/app-navigator"
import { createAppContainer, createSwitchNavigator } from "react-navigation"
import { SearchScreen } from "../screens/search-screen/search-screen"
import { AuthStack } from "./auth-navigator"

export const RootNavigator = createAppContainer(createSwitchNavigator(
  {
    searchScreen: { screen: SearchScreen },
    Auth: AuthStack,
    App: AppNavigator
  },
  {
    initialRouteName: "Auth"
  }
))
