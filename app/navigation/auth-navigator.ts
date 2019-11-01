import { AuthScreen, LoginScreen } from "@screens/auth"
import { createStackNavigator } from "react-navigation-stack";
import { RegisterFlow } from "@navigation/register-navigator"
import { AuthScreens } from "@navigation/navigation-definitions"
import { ResetPasswordScreen } from "@screens/reset-password-screen"

export const AuthStack = createStackNavigator(
  {
    [AuthScreens.AUTH]: { screen: AuthScreen },
    [AuthScreens.LOGIN]: { screen: LoginScreen },
    [AuthScreens.REGISTER]: { screen: RegisterFlow },
    [AuthScreens.RESET_PASSWORD]: { screen: ResetPasswordScreen }
  },
  {
    headerMode: "none"
  })
