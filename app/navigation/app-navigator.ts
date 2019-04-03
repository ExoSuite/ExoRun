import { createDrawerNavigator } from "react-navigation"
import { AppScreens } from "@navigation/navigation-definitions"
import { AppStackNavigator } from "@navigation/app-stack-navigator"

export const AppNavigator = createDrawerNavigator({
  [AppScreens.HOME]: AppStackNavigator
})
