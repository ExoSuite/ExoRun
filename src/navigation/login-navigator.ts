import { createStackNavigator } from "react-navigation";
import { LoginScreen } from "../views/login-screen/login-screen";

export const LoginScreenNav = createStackNavigator({
    screenLogin : { screen: LoginScreen },
  },
  {
    headerMode: "none",
  });
