import { AuthScreen, LoginScreen } from "@screens/auth"
import { createStackNavigator } from "react-navigation"
import { RegisterFlow } from "@navigation/register-navigator"
import { AuthScreens } from "@navigation/navigation-definitions"

export const AuthStack = createStackNavigator(
  {
    [AuthScreens.AUTH]: { screen: AuthScreen },
    [AuthScreens.LOGIN]: { screen: LoginScreen },
    [AuthScreens.REGISTER]: { screen: RegisterFlow }
  },
  {
    headerMode: "none"
  })
