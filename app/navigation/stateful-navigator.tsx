import * as React from "react"
import { inject, observer } from "mobx-react"
// @ts-ignore: until they update @type/react-navigation
import { getNavigation, NavigationScreenProp, NavigationState } from "react-navigation"
import { RootNavigator } from "./root-navigator"
import { IImageProperties, SplashScreen } from "@screens/auth/splash-screen"
import autobind from "autobind-decorator"
import { Asset } from "@services/asset"
import { color } from "@theme"
import { Screen } from "@services/device"
import { Injection, InjectionProps } from "@services/injections"
import { IVoidFunction } from "@custom-types"

interface IScreenProps {
  animateSplashScreen: IVoidFunction,
  showSplashScreen: IVoidFunction
}

export interface INavigationScreenProps {
  navigation: {
    getScreenProps: IScreenProps
  }
}

const IMAGE_STYLE: IImageProperties = {
  height: Screen.Height,
  width: Screen.Width
}

const exosuiteLoader = Asset.Locator("exosuite-loader")

/**
 * StatefulNavigator will handle the SplashScreen component
 * user can be redirected to login or home screen.
 */
@inject(Injection.NavigationStore, Injection.Api, Injection.UserModel, Injection.GroupsModel)
@observer
export class StatefulNavigator extends React.Component<InjectionProps> {
  private currentNavProp: NavigationScreenProp<NavigationState>

  private loader: SplashScreen = null

  // tslint:disable-next-line: no-feature-envy
  private async canLogin(): Promise<void> {
    const { api, userModel } = this.props

    await api.getOrCreatePersonalTokens()
    await api.getProfile(userModel)
  }

  @autobind
  private async removeLoader(): Promise<void> {
    try {
      await this.canLogin()
    } catch (exception) {
      console.tron.logImportant(exception, exception.message)
      this.returnToLogin()
    }
    this.animateSplashScreen()
  }

  private returnToLogin(): void {
    const { navigationStore } = this.props

    if (navigationStore.reset) {
      navigationStore.reset()
    }
  }

  @autobind
  private setSplashScreenRef(ref: SplashScreen): void {
    this.loader = ref
  }

  @autobind
  public animateSplashScreen(): void {
    this.loader.animate()
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
    const { showSplashScreen, animateSplashScreen } = this

    const screenNavigationParams: IScreenProps = {
      showSplashScreen,
      animateSplashScreen
    }

    // create a custom navigation implementation
    this.currentNavProp = getNavigation(
      RootNavigator.router,
      state,
      dispatch,
      actionSubscribers(),
      screenNavigationParams,
      this.getCurrentNavigation
    )

    return (
      <SplashScreen
        ref={this.setSplashScreenRef}
        backgroundColor={color.palette.backgroundDarker}
        imageProperties={IMAGE_STYLE}
        imageSource={exosuiteLoader}
      >
        <RootNavigator navigation={this.currentNavProp} theme="dark"/>
      </SplashScreen>
    )
  }

  @autobind
  public showSplashScreen(): void {
    this.loader.reset()
  }
}
