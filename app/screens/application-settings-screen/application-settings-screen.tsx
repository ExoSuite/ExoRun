import * as React from "react"
import { observer } from "mobx-react"
import { ViewStyle } from "react-native"
import { Button, Screen } from "@components"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import autobind from "autobind-decorator"
import { reset } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { inject } from "mobx-react/native"
import { Injection } from "@services/injections"
import { NavigationStore } from "@navigation/navigation-store"
import { INavigationScreenProps } from "@navigation/stateful-navigator"
import { clear } from "@utils/storage"

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
@inject(Injection.NavigationStore)
@observer
export class ApplicationSettingsScreen extends React.Component<IApplicationSettingsScreenProps> {
  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator,
  }

  @autobind
  private async logout(): Promise<void> {
    const { navigationStore, navigation } = this.props
    navigation.getScreenProps.showSplashScreen()
    navigationStore.smoothReset(navigation.getScreenProps.animateSplashScreen)
    await reset(Server.EXOSUITE_USERS_API)
    await clear()
  }

  // tslint:disable-next-line: prefer-function-over-method
  public render(): React.ReactNode {
    return (
      <Screen style={ROOT} preset="fixedStack">
        <Button preset="primary" text="se déconnecter" onPress={this.logout}/>
      </Screen>
    )
  }
}
