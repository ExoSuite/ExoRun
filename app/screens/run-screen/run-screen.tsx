import * as React from "react"
import { PermissionsAndroid, ViewStyle } from "react-native"
import { Screen } from "@components/screen"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { Button } from "@components/button"
import { AppScreens } from "@navigation/navigation-definitions"
import { IBoolFunction } from "@custom-types"
import autobind from "autobind-decorator"
// tslint:disable-next-line: match-default-export-name
import DeviceInfo from "react-native-device-info"
import { IPersonalProfileNavigationScreenProps } from "@screens/user-profile-screen"
import { Platform } from "@services/device"

export interface IRunScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black
}

const runNavigationParams : IPersonalProfileNavigationScreenProps = {
  me: true
}

/**
 * RunScreen
 */
export class RunScreen extends React.Component<IRunScreenProps> {

  @autobind
  private goTo(screen: AppScreens, params: object = {}): IBoolFunction {
    return (): boolean => this.props.navigation.navigate(screen, params)
  }

  @autobind
  private goToAugmentedReality(): void {
    this.props.navigation.navigate(AppScreens.AUGMENTED_REALITY)
  }

  // tslint:disable-next-line: no-feature-envy
  public componentDidMount(): void {
    if (Platform.Android) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).catch()
    }
  }

  public render(): React.ReactNode {
    return (
      <Screen style={ROOT} preset="scroll">
        <Button text="Réalité augmentée" onPress={this.goToAugmentedReality} style={{ marginTop: spacing[3] }}/>
        <Button text="Mapbox" onPress={this.goTo(AppScreens.MAP)} style={{ marginTop: spacing[3] }}/>
        <Button text="Parcours" onPress={this.goTo(AppScreens.RUNS, runNavigationParams)} style={{marginTop: spacing[3]}}/>
        {/*<Button
          text="Requetes en attentes"
          onPress={this.goTo(AppScreens.PENDING_REQUESTS, runNavigationParams)}
          style={{marginTop: spacing[3]}}
        />*/}
      </Screen>
    )
  }
}
