import { createStackNavigator } from "react-navigation";
import { Auth } from "src/views/Auth"

export const AuthNavigator = createStackNavigator({
    Auth: { screen: Auth }
  },
  {
    headerMode: "none",
  });
