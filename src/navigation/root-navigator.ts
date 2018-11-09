import { createStackNavigator } from "react-navigation";
import { AuthNavigator } from "./auth-navigator";

export const RootNavigator = createStackNavigator(
  {
    auth: { screen: AuthNavigator }
  },
  {
    headerMode: "none",
    navigationOptions: { gesturesEnabled: false }
  }
);
