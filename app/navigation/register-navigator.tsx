import * as React from "react"
import { createStackNavigator, HeaderBackButtonProps } from "react-navigation"
import { FirstStepRegisterScreen, SecondStepRegisterScreen } from "@screens/auth"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { color } from "@theme"
import { LogoHeader } from "@components/logo-header"
import { RegisterScreens } from "@navigation/navigation-definitions"
import { headerShadow } from "@utils/shadows"

export const RegisterFlow = createStackNavigator(
  {
    [RegisterScreens.FIRST]: { screen: FirstStepRegisterScreen },
    [RegisterScreens.SECOND]: { screen: SecondStepRegisterScreen }
  }, {
    initialRouteName: RegisterScreens.FIRST,
    headerMode: "float",
    // @ts-ignore
    defaultNavigationOptions: {
      headerLeft: (props: HeaderBackButtonProps): React.ReactNode => (
        <NavigationBackButtonWithNestedStackNavigator {...props}/>
      ),
      headerTitle: (props: any): React.ReactNode => <LogoHeader {...props}/>,
      headerStyle: {
        backgroundColor: color.backgroundDarkerer,
        borderBottomWidth: 0,
        ...headerShadow
      },
    },
  }
)
