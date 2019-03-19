import { Button, Screen } from "@components"
import { color } from "@theme"
import { observer } from "mobx-react"
import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import autobind from "autobind-decorator"

export interface IHomeScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background,
}

/**
 * HomeScreen when an user is logged in, he will be redirected here.
 */
@observer
export class HomeScreen extends React.Component<IHomeScreenProps> {

  @autobind
  private navigateToAR(): void {
    const { navigation } = this.props
    navigation.navigate("AugmentedRealityScreen")
  }

  public render(): React.ReactNode {

    return (
      <Screen style={ROOT} preset="fixedCenter">
        <Button
          text="aller vers l'AR"
          onPress={this.navigateToAR}
        />
      </Screen>
    )
  }
}
