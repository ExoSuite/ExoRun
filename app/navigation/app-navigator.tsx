import { AugmentedRealityNavigator } from "@screens/augmented-reality-screen"
import { HomeScreen } from "@screens/home-screen"
import { color } from "@theme"
import { createStackNavigator } from "react-navigation"
import { AppScreens } from "@navigation/navigation-definitions"
import * as React from "react"
import { LogoHeader } from "@components/logo-header"
import { headerShadow } from "@utils/shadows"

export const AppStack = createStackNavigator(
  {
    [AppScreens.HOME]: { screen: HomeScreen },
    [AppScreens.AUGMENTED_REALITY]: { screen: AugmentedRealityNavigator }
  }, {
    // @ts-ignore
    defaultNavigationOptions: {
      headerTitle: (props: any): React.ReactNode => <LogoHeader/>,
      headerStyle: {
        backgroundColor: color.backgroundDarkerer,
        borderBottomWidth: 0,
        ...headerShadow
      }
    }
  })
