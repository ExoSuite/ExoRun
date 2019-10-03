import { createDrawerNavigator } from "react-navigation-drawer"
import { AppScreens } from "@navigation/navigation-definitions"
import { AppStackNavigator } from "@navigation/app-stack-navigator"
import { DrawerNavigation } from "@navigation/components/drawer-navigation"

export const AppNavigator = createDrawerNavigator({
  [AppScreens.HOME]: AppStackNavigator
}, {
  contentComponent: DrawerNavigation
})
