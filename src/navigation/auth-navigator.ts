import { createStackNavigator } from "react-navigation";
import {AuthScreen, LoginScreen, RegisterScreen} from "src/views/auth";

export const AuthNavigator = createStackNavigator(
  {
    auth: { screen: AuthScreen },
    login: { screen: LoginScreen },
    register: { screen: RegisterScreen }
  },
  {
    headerMode: "none"
  });
