import { createSwitchNavigator } from "react-navigation";
import { Home } from "src/views/home";
import { AuthNavigator } from "./auth-navigator";

export const RootNavigator = createSwitchNavigator(
  {
    auth: { screen: AuthNavigator },
    home: { screen: Home },
  },
  {
    initialRouteName: "auth"
  }
);
