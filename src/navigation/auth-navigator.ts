import { createStackNavigator } from "react-navigation";
import { LoginScreen, RegisterScreen } from "src/views/auth";

export const AuthNavigator = createStackNavigator({
    login: { screen: LoginScreen },
    register: { screen: RegisterScreen }
  },
  {
    headerMode: "none"
  });
