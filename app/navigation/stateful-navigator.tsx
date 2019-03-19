import * as React from "react"
import { inject, observer } from "mobx-react"
// @ts-ignore: until they update @type/react-navigation
import { getNavigation, NavigationScreenProp, NavigationState } from "react-navigation"

import { RootNavigator } from "./root-navigator"
import { NavigationStore } from "./navigation-store"
import { ImageProperties, SplashScreen } from "@screens/auth/splash-screen"
import autobind from "autobind-decorator"
import { Asset } from "@services/asset"
import { color } from "@theme"
import { Screen } from "@services/device"
import { Injection } from "@services/injections"
import { Api } from "@services/api"

interface IStatefulNavigatorProps {
  api?: Api
  navigationStore?: NavigationStore,
}

const IMAGE_STYLE: ImageProperties = {
  height: Screen.Height,
  width: Screen.Width,
}

/**
 * StatefulNavigator will handle the SplashScreen component
 * user can be redirected to login or home screen.
 */
@inject(Injection.NavigationStore, Injection.Api)
@observer
export class StatefulNavigator extends React.Component<IStatefulNavigatorProps> {
  private currentNavProp: NavigationScreenProp<NavigationState>

  private loader: SplashScreen = null

  @autobind
  private async removeLoader(): Promise<void> {
    const { api, navigationStore } = this.props
    try {
      await api.checkToken()
      navigationStore.navigateTo("HomeScreen")
    } catch (exception) {
      this.returnToLogin()
    }
    this.loader.animate()
  }

  private returnToLogin(): void {
    const { navigationStore } = this.props
    if (navigationStore.findCurrentRoute().routeName === "Home") {
      navigationStore.reset()
    }
  }

  @autobind
  private setSplashScreenRef(ref: SplashScreen): void {
    this.loader = ref
  }

  public async componentDidMount(): Promise<void> {
    await this.removeLoader()
  }

  public getCurrentNavigation = (): NavigationScreenProp<NavigationState> => {
    return this.currentNavProp
  }

  public render(): React.ReactNode {
    // grab our state & dispatch from our navigation store
    const { state, dispatch, actionSubscribers } = this.props.navigationStore

    // create a custom navigation implementation
    this.currentNavProp = getNavigation(
      RootNavigator.router,
      state,
      dispatch,
      actionSubscribers(),
      {},
      this.getCurrentNavigation,
    )

    return (
      <SplashScreen
        ref={this.setSplashScreenRef}
        backgroundColor={color.palette.backgroundDarker}
        imageProperties={IMAGE_STYLE}
        imageSource={Asset.Locator("exosuite-loader")}
      >
        <RootNavigator navigation={this.currentNavProp}/>
      </SplashScreen>
    )
  }
}
