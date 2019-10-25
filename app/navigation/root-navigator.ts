import { AppNavigator } from "@navigation/app-navigator"
import { createAppContainer, createSwitchNavigator } from "react-navigation"
import { RunDetailsScreen } from "../screens/run-details-screen/run-details-screen"
import { RunsScreen } from "../screens/runs-screen/runs-screen"
import { FriendshipsListScreen } from "../screens/friendships-list-screen/friendships-list-screen"
import { FollowsListScreen } from "../screens/follows-list-screen/follows-list-screen"
import { FollowersListScreen } from "../screens/followers-list-screen/followers-list-screen"
import { AuthStack } from "./auth-navigator"

export const RootNavigator = createAppContainer(createSwitchNavigator(
  {
    runDetailsScreen: { screen: RunDetailsScreen },
    runsScreen: { screen: RunsScreen },
    friendshipsListScreen: { screen: FriendshipsListScreen },
    followsListScreen: { screen: FollowsListScreen },
    followersListScreen: { screen: FollowersListScreen },
    Auth: AuthStack,
    App: AppNavigator
  },
  {
    initialRouteName: "Auth"
  }
))
