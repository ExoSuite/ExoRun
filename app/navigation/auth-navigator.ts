import { AuthScreen, LoginScreen, RegisterScreen } from "@screens/auth"
import { createStackNavigator } from "react-navigation"

export const AuthStack = createStackNavigator(
  {
    auth: { screen: AuthScreen },
    login: { screen: LoginScreen },
    register: { screen: RegisterScreen },
  },
  {
    headerMode: "none",
  })
