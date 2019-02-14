import { HomeScreen } from "@screens/home-screen"
import { createStackNavigator } from "react-navigation"
import { AugmentedRealityNavigator } from "@screens/augmented-reality-screen"
import { color } from "@theme"

export const AppStack = createStackNavigator(
  {
    HomeScreen,
    AugmentedRealityScreen: AugmentedRealityNavigator,
  }, {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: color.palette.backgroundDarkerer,
        borderBottomColor: "transparent",
        shadowColor: "black",
        shadowOpacity: 0.7,
        shadowOffset: { width: 2, height: 3 },
      },
    },
    navigationOptions: {
      tabBarLabel: "Home!",
    },
  })
