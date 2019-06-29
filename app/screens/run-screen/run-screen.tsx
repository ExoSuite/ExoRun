import * as React from "react"
import { ViewStyle } from "react-native"
import { Screen } from "@components/screen"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { Button } from "@components/button"
import { AppScreens } from "@navigation/navigation-definitions"
import { IBoolFunction } from "@types"
import autobind from "autobind-decorator"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"

export interface IRunScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

/**
 * RunScreen
 */
export class RunScreen extends React.Component<IRunScreenProps> {

  @autobind
  private goTo(screen: AppScreens): IBoolFunction {
    return (): boolean => this.props.navigation.navigate(screen)
  }

  public render(): React.ReactNode {
    return (
      <Screen style={ROOT} preset="scroll">
        <Button text="Réalité augmentée" onPress={this.goTo(AppScreens.AUGMENTED_REALITY)} style={{marginTop: spacing[3]}}/>
        <Button text="Mapbox" onPress={this.goTo(AppScreens.MAP)} style={{marginTop: spacing[3]}}/>
      </Screen>
    )
  }
}
