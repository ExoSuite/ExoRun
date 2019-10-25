import { NavigationLeafRoute } from "react-navigation"
import { AppScreens } from "@navigation/navigation-definitions"

export function userIsOnChatScreen(currentRoute: NavigationLeafRoute): boolean {
  return currentRoute.routeName === AppScreens.CHAT
}
