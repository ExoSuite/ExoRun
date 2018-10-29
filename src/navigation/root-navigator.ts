import { createStackNavigator } from "react-navigation"
import { PizzaLocationList } from "../views/example/pizza-location-list/pizza-location-list-screen"
import { ExampleNavigator } from "./example-navigator"

export const RootNavigator = createStackNavigator(
  {
    pizzaLocationList: { screen: PizzaLocationList },
    exampleStack: { screen: ExampleNavigator },
  },
  {
    headerMode: "none",
    navigationOptions: { gesturesEnabled: false },
  },
);
