import * as React from "react"
import { observer } from "mobx-react"
import { ViewStyle } from "react-native"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { color } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"

export interface IPersonalProfileScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background,
}

/**
 * UserProfileScreen will handle a user profile
 */
// @inject("mobxstuff")
@observer
export class UserProfileScreen extends React.Component<IPersonalProfileScreenProps, {}> {
  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator,
  }

  // tslint:disable-next-line: prefer-function-over-method
  public render(): React.ReactNode {
    return (
      <Screen style={ROOT} preset="fixedCenter">
        <Text preset="header" text="bienvenue sur votre page de profil" />
      </Screen>
    )
  }
}
