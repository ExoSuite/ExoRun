import { createStackNavigator } from "react-navigation"
import { FirstStepRegisterScreen, SecondStepRegisterScreen } from "@screens/auth"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { color } from "@theme"
import { LogoHeader } from "@components/logo-header"
import { RegisterScreens } from "@navigation/navigation-definitions"
import { headerShadow } from "@utils/shadows"
import { IosStyle } from "@navigation/transitions/ios-style"

export const RegisterFlow = createStackNavigator(
  {
    [RegisterScreens.FIRST]: { screen: FirstStepRegisterScreen },
    [RegisterScreens.SECOND]: { screen: SecondStepRegisterScreen }
  }, {
    initialRouteName: RegisterScreens.FIRST,
    headerMode: "float",
    // @ts-ignore
    defaultNavigationOptions: {
      headerLeft: NavigationBackButtonWithNestedStackNavigator,
      headerTitle: LogoHeader,
      headerStyle: {
        backgroundColor: color.backgroundDarkerer,
        borderBottomWidth: 0,
        ...headerShadow
      }
    },
    headerLayoutPreset: "center",
    transitionConfig: IosStyle
  }
)
