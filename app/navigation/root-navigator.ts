import { AppNavigator } from "@navigation/app-navigator"
import { createAppContainer, createSwitchNavigator } from "react-navigation"
import { ChooseUserRunScreen } from "../screens/choose-user-run-screen/choose-user-run-screen"
import { AuthStack } from "./auth-navigator"

export const RootNavigator = createAppContainer(createSwitchNavigator(
  {
    chooseUserRunScreen: { screen: ChooseUserRunScreen },
    pendingRequestsScreen: { screen: PendingRequestsScreen },
    Auth: AuthStack,
    App: AppNavigator
  },
  {
    initialRouteName: "Auth"
  }
))
