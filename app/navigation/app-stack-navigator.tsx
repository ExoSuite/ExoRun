import { createStackNavigator } from "react-navigation"
import { AppScreens } from "@navigation/navigation-definitions"
import * as React from "react"
import { LogoHeader } from "@components/logo-header"
import { color } from "@theme"
import { headerShadow } from "@utils/shadows"
import { AppBottomTabNavigator } from "@navigation/app-bottom-tab-navigator"

export const AppStackNavigator = createStackNavigator({
  [AppScreens.HOME]: AppBottomTabNavigator
}, {
  // @ts-ignore
  defaultNavigationOptions: {
    headerTitle: (props: any): React.ReactNode => <LogoHeader {...props}/>,
    headerStyle: {
      backgroundColor: color.backgroundDarkerer,
      borderBottomWidth: 0,
      ...headerShadow
    }
  }
})
