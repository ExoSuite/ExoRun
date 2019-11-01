import { AppNavigator } from "@navigation/app-navigator"
import { createAppContainer, createSwitchNavigator } from "react-navigation"
import { PendingRequestsScreen } from "../screens/pending-requests-screen/pending-requests-screen"
import { AuthStack } from "./auth-navigator"

export const RootNavigator = createAppContainer(createSwitchNavigator(
  {
    pendingRequestsScreen: { screen: PendingRequestsScreen },
    Auth: AuthStack,
    App: AppNavigator
  },
  {
    initialRouteName: "Auth"
  }
))
