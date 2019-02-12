import { createAppContainer, createSwitchNavigator } from "react-navigation"
import { AuthStack } from "./auth-navigator"
import { AppStack } from "@navigation/app-navigator"

export const RootNavigator = createAppContainer(createSwitchNavigator(
  {
    Auth: AuthStack,
    App: AppStack
  },
  {
    initialRouteName: "Auth",
  },
))
