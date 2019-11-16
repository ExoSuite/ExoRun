import { AppNavigator } from "@navigation/app-navigator"
import { createAppContainer, createSwitchNavigator } from "react-navigation"
import { AuthStack } from "./auth-navigator"

export const RootNavigator = createAppContainer(createSwitchNavigator(
  {
    Auth: AuthStack,
    App: AppNavigator
  },
  {
    initialRouteName: "Auth"
  }
))
