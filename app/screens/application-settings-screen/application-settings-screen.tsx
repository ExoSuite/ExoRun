import * as React from "react"
import { inject, observer } from "mobx-react"
import { View, ViewStyle } from "react-native"
import { Button, Screen } from "@components"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { defaultNavigationIcon, NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import autobind from "autobind-decorator"
import { ServerReset } from "@services/api/api.servers"
import { Injection, InjectionProps } from "@services/injections"
import { NavigationStore } from "@navigation/navigation-store"
import { INavigationScreenProps } from "@navigation/stateful-navigator"
import { clear } from "@utils/storage"
import { clearAllStorage } from "@utils/storage/clearAllStorage"

type ApplicationSettingsScreenPropsType = INavigationScreenProps & NavigationScreenProps<{}>

export interface IApplicationSettingsScreenProps extends ApplicationSettingsScreenPropsType {
  navigationStore: NavigationStore
}

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  padding: spacing[4]
}

/**
 * ApplicationSettingsScreen will handle the in app settings
 */
@inject(Injection.NavigationStore, Injection.SocketIO)
@observer
export class ApplicationSettingsScreen extends React.Component<IApplicationSettingsScreenProps & InjectionProps> {
  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator({
      iconName: defaultNavigationIcon
    })
  }

  @autobind
  private async logout(): Promise<void> {
    const { navigationStore, navigation, socketIO } = this.props
    navigation.getScreenProps.showSplashScreen()
    await clearAllStorage()
    socketIO.disconnect()
    navigationStore.smoothReset(navigation.getScreenProps.animateSplashScreen)
  }

  public render(): React.ReactNode {
    return (
      <Screen style={ROOT} preset="fixed">
        <View style={{ margin: spacing[2], padding: spacing[2] }}>
          <Button preset="primary" textPreset="primaryBold" text="Se déconnecter" onPress={this.logout}/>
        </View>
      </Screen>
    )
  }
}
