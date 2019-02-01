import { createSwitchNavigator } from "react-navigation"
import { AuthNavigator } from "./auth-navigator"

export const RootNavigator = createSwitchNavigator(
  {
    auth: { screen: AuthNavigator }
  },
  {
    initialRouteName: "auth"
  }
)
