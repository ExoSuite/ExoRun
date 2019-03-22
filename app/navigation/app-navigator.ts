import { AugmentedRealityNavigator } from "@screens/augmented-reality-screen"
import { HomeScreen } from "@screens/home-screen"
import { color } from "@theme"
import { createStackNavigator } from "react-navigation"

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
