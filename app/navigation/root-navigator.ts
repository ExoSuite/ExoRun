import { AppNavigator } from "@navigation/app-navigator"
import { createAppContainer, createSwitchNavigator } from "react-navigation"
import { RunDetailsScreen } from "../screens/run-details-screen/run-details-screen"
import { RunsScreen } from "../screens/runs-screen/runs-screen"
import { AuthStack } from "./auth-navigator"

export const RootNavigator = createAppContainer(createSwitchNavigator(
  {
    runDetailsScreen: { screen: RunDetailsScreen },
    runsScreen: { screen: RunsScreen },
    Auth: AuthStack,
    App: AppNavigator
  },
  {
    initialRouteName: "Auth"
  }
))
