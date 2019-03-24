import { Button, Screen } from "@components"
import { color } from "@theme"
import { observer } from "mobx-react"
import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import autobind from "autobind-decorator"
import { AppScreens } from "@navigation/navigation-definitions"
import { inject } from "mobx-react/native"
import { Injection } from "@services/injections"
import { NavigationStore } from "@navigation/navigation-store"
import { INavigationScreenProps } from "@navigation/stateful-navigator"

type HomeNavigationScreenPropsType = INavigationScreenProps & NavigationScreenProps<{}>

export interface IHomeScreenProps extends HomeNavigationScreenPropsType {
  navigationStore: NavigationStore
}

const ROOT: ViewStyle = {
  backgroundColor: color.background
}

/**
 * HomeScreen when an user is logged in, he will be redirected here.
 */
@inject(Injection.NavigationStore)
@observer
export class HomeScreen extends React.Component<IHomeScreenProps> {

  @autobind
  private async logout(): Promise<void> {
    const { navigationStore, navigation } = this.props
    navigation.getScreenProps.showSplashScreen()
    navigationStore.smoothReset(navigation.getScreenProps.animateSplashScreen)
    // tslint:disable-next-line
    // await reset(Server.EXOSUITE_USERS_API)
  }

  @autobind
  private navigateToAR(): void {
    const { navigation } = this.props
    navigation.navigate(AppScreens.AUGMENTED_REALITY)
  }

  public render(): React.ReactNode {

    return (
      <Screen style={ROOT} preset="fixedCenter">
        <Button
          text="aller vers l'AR"
          onPress={this.navigateToAR}
        />
        <Button
          text="se déconnecter"
          onPress={this.logout}
          style={{marginTop: 30}}
        />
      </Screen>
    )
  }
}
