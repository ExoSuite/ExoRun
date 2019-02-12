import * as React from "react"
import { inject, observer } from "mobx-react"
// @ts-ignore: until they update @type/react-navigation
import { getNavigation, NavigationScreenProp, NavigationState } from "react-navigation"

import { RootNavigator } from "./root-navigator"
import { NavigationStore } from "./navigation-store"
import { SplashScreen, ImageProperties } from "@screens/auth/splash-screen"
import autobind from "autobind-decorator"
import { Asset } from "@services/asset"
import { color } from "@theme"
import { Screen } from "@services/device"
import { Injection } from "@services/injections"

interface StatefulNavigatorProps {
  navigationStore?: NavigationStore
}

const IMAGE_STYLE: ImageProperties = {
  height: Screen.Height,
  width: Screen.Width
}

@inject(Injection.NavigationStore)
@observer
export class StatefulNavigator extends React.Component<StatefulNavigatorProps, {}> {
  currentNavProp: NavigationScreenProp<NavigationState>

  loader: SplashScreen = null

  getCurrentNavigation = () => {
    return this.currentNavProp
  }

  @autobind
  removeLoader() {
    this.loader.animate()
    this.props.navigationStore.navigateTo("HomeScreen")
  }

  async componentDidMount() {
    setTimeout(this.removeLoader, 2000)
  }

  render() {
    // grab our state & dispatch from our navigation store
    const { state, dispatch, actionSubscribers } = this.props.navigationStore

    // create a custom navigation implementation
    this.currentNavProp = getNavigation(
      RootNavigator.router,
      state,
      dispatch,
      actionSubscribers(),
      {},
      this.getCurrentNavigation
    )

    return (
      <SplashScreen
        ref={(ref: SplashScreen) => this.loader = ref}
        backgroundColor={color.palette.backgroundDarker}
        imageProperties={IMAGE_STYLE}
        imageSource={Asset.Locator("exosuite-loader")}
      >
        <RootNavigator navigation={this.currentNavProp}/>
      </SplashScreen>
    )
  }
}
