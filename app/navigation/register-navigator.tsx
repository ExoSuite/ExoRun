import * as React from "react"
import { createStackNavigator, HeaderBackButtonProps } from "react-navigation"
import { RegisterScreen } from "@screens/auth"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { color } from "@theme"
import { LogoHeader } from "@components/logo-header"
import { Platform } from "react-native"

const platformShadow = Platform.select({
  android: {
    elevation: 3,
  },
  ios: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
  },
  default: {},
});

export const RegisterFlow = createStackNavigator(
  {
    register: { screen: RegisterScreen }
  }, {
    initialRouteName: "register",
    headerMode: "screen",
    // @ts-ignore
    defaultNavigationOptions: {
      headerLeft: (props: HeaderBackButtonProps): React.ReactNode => (
          <NavigationBackButtonWithNestedStackNavigator {...props}/>
      ),
      headerTitle: (props: any): React.ReactNode => <LogoHeader/>,
      headerStyle: {
        backgroundColor: color.backgroundDarkerer,
        borderBottomWidth: 0,
        ...platformShadow
      },
    }
  }
)
