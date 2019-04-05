// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.
// import library modules
import * as React from "react"
import { Environment } from "@models/environment"
import { RootStore, setupRootStore } from "@models/root-store"
import { BackButtonHandler } from "@navigation/back-button-handler"
import { DEFAULT_NAVIGATION_CONFIG } from "@navigation/navigation-config"
import { Platform } from "@services/device"
import { Provider } from "mobx-react"
import { contains } from "ramda"
import { AppRegistry } from "react-native"
import Config from "react-native-config"
import SplashScreen from "react-native-splash-screen"
import { StorybookUIRoot } from "../storybook"
import "./i18n"
import { StatefulNavigator } from "./navigation"
import { DataLoader } from "@components/data-loader"

interface IAppState {
  env?: Environment
  rootStore?: RootStore
}

/**
 * This is the root component of our app.
 */
export class App extends React.Component<{}, IAppState> {
  /**
   * Are we allowed to exit the app?  This is called when the back button
   * is pressed on android.
   *
   * @param routeName The currently active route name.
   */
  private static canExit(routeName: string): boolean {
    return contains(routeName, DEFAULT_NAVIGATION_CONFIG.exitRoutes)
  }

  private static setDataLoaderInstance(ref: DataLoader): void {
    DataLoader.Instance = ref
  }

  private stateNotReady(property: string): Object | undefined {
    try {
      return this.state[property]
    } catch (error) {
      return undefined
    }
  }

  /**
   * When the component is mounted. This happens asynchronously and simply
   * re-renders when we're good to go.
   */
  public async componentDidMount(): Promise<void> {
    const store = await setupRootStore()
    this.setState(
      {
        env: store.env,
        rootStore: store.rootStore,
      },
      () => {
        // hack to ignore white screen on android
        if (Platform.Android) {
          setTimeout(() => {
            SplashScreen.hide()
          }, 500)
        } else {
          SplashScreen.hide()
        }
      },
    )
  }

  public render(): React.ReactNode {
    // Before we show the app, we have to wait for our state to be ready.
    // In the meantime, don't render anything. This will be the background
    // color set in native by rootView's background color.
    //
    // This step should be completely covered over by the splash screen though.
    //
    // You're welcome to swap in your own component to render if your boot up
    // sequence is too slow though.

    if (this.stateNotReady("rootStore") === undefined || this.stateNotReady("env") === undefined) {
      return null
    }

    const rootStore = this.state.rootStore
    const env = this.state.env

    // otherwise, we're ready to render the app

    // --- am: begin list of stores ---
    const otherStores = {
      api: env.api,
      soundPlayer: env.soundPlayer,
    }
    // --- am: end list of stores ---

    return (
      <Provider rootStore={rootStore} navigationStore={rootStore.navigationStore} {...otherStores}>
        <BackButtonHandler canExit={App.canExit}>
          <StatefulNavigator />
          <DataLoader ref={App.setDataLoaderInstance} />
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

AppRegistry.registerComponent(APP_NAME, () => (SHOW_STORYBOOK && __DEV__ ? StorybookUIRoot : App))