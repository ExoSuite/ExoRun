import { AuthScreen, LoginScreen } from "@screens/auth"
import { createStackNavigator } from "react-navigation"
import { RegisterFlow } from "@navigation/register-navigator"

export const AuthStack = createStackNavigator(
  {
    auth: { screen: AuthScreen },
    login: { screen: LoginScreen },
    register: { screen: RegisterFlow }
  },
  {
    headerMode: "none"
  })
