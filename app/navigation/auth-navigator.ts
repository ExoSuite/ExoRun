import { createStackNavigator } from "react-navigation"
import { AuthScreen, LoginScreen, RegisterScreen } from "@screens/auth"

export const AuthNavigator = createStackNavigator(
  {
    auth: { screen: AuthScreen },
    login: { screen: LoginScreen },
    register: { screen: RegisterScreen }
  },
  {
    headerMode: "none"
  })
