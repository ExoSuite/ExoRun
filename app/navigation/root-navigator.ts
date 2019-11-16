import { AppNavigator } from "@navigation/app-navigator"
import { createAppContainer, createSwitchNavigator } from "react-navigation"
import { AuthStack } from "./auth-navigator"
import { PendingRequestsScreen } from "@screens/pending-requests-screen"

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
