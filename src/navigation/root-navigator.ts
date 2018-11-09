import { createStackNavigator } from "react-navigation";
import { LoginScreenNav } from "./login-navigator"
import { ExampleNavigator } from "./example-navigator";

export const RootNavigator = createStackNavigator(
  {
    loginScreenStack: { screen: LoginScreenNav },
    exampleStack: { screen: ExampleNavigator },
  },
  {
    headerMode: "none",
    navigationOptions: { gesturesEnabled: false },
  },
);
