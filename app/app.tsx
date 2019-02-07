// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

// import lang module
import "./i18n"
// import library modules
import * as React from "react"
import { AppRegistry } from "react-native"
import { Provider } from "mobx-react"
import { contains } from "ramda"
import SplashScreen from "react-native-splash-screen"
import Config from "react-native-config"
// custom imports
import { StatefulNavigator } from "./navigation"
import { StorybookUIRoot } from "../storybook"
import { RootStore, setupRootStore } from "@models/root-store"
import { BackButtonHandler } from "@navigation/back-button-handler"
import { DEFAULT_NAVIGATION_CONFIG } from "@navigation/navigation-config"
import { Platform } from "@services/device"
import { Environment } from "@models/environment"
import { DataLoader } from "@components/data-loader"

interface AppState {
  rootStore?: RootStore
  env?: Environment
}

/**
 * This is the root component of our app.
 */
export class App extends React.Component<{}, AppState> {
  /**
   * When the component is mounted. This happens asynchronously and simply
   * re-renders when we're good to go.
   */
  async componentDidMount() {
    // hack to ignore white screen on android
    if (Platform.Android) {
      setTimeout(() => {
        SplashScreen.hide()
      }, 500)
    } else {
      SplashScreen.hide()
    }

    const store = await setupRootStore()
    this.setState({
      rootStore: store.rootStore,
      env: store.env
    })
  }

  /**
   * Are we allowed to exit the app?  This is called when the back button
   * is pressed on android.
   *
   * @param routeName The currently active route name.
   */
  canExit(routeName: string) {
    return contains(routeName, DEFAULT_NAVIGATION_CONFIG.exitRoutes)
  }

  render() {
    const rootStore = this.state && this.state.rootStore
    const env = this.state && this.state.env

    // Before we show the app, we have to wait for our state to be ready.
    // In the meantime, don't render anything. This will be the background
    // color set in native by rootView's background color.
    //
    // This step should be completely covered over by the splash screen though.
    //
    // You're welcome to swap in your own component to render if your boot up
    // sequence is too slow though.
    if (!rootStore || !env) {
      return null
    }

    // otherwise, we're ready to render the app

    // --- am: begin list of stores ---
    const otherStores = {
      api: env.api,
      soundPlayer: env.soundPlayer
    }
    // --- am: end list of stores ---

    return (
      <Provider rootStore={rootStore} navigationStore={rootStore.navigationStore} {...otherStores}>
        <BackButtonHandler canExit={this.canExit}>
          <StatefulNavigator/>
          <DataLoader ref={(ref) => {
            DataLoader.instance = ref
          }}/>
        </BackButtonHandler>
      </Provider>
    )
  }
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */
const APP_NAME = "ExoRun"

// Should we show storybook instead of our app?
//
// ⚠️ Leave this as `false` when checking into git.
const SHOW_STORYBOOK = JSON.parse(Config.STORYBOOK_ENABLED)

const RootComponent = SHOW_STORYBOOK && __DEV__ ? StorybookUIRoot : App
AppRegistry.registerComponent(APP_NAME, () => RootComponent)
