import * as React from "react"
import { Injection } from "@services/injections"
import { inject, observer } from "mobx-react"
import { BackHandler } from "react-native"
import { NavigationActions } from "react-navigation"
import { NavigationStore } from "./navigation-store"

interface IBackButtonHandlerProps {
  navigationStore?: NavigationStore

  /**
   * Are we allowed to exit?
   */
  canExit(routeName: string): boolean
}

/**
 * BackButtonHandler will be only called when we launch the app on Android
 */
@inject(Injection.NavigationStore)
@observer
export class BackButtonHandler extends React.Component<IBackButtonHandlerProps> {
  /**
   * Subscribe when we come to life.
   */
  public componentDidMount(): void {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
  }

  /**
   * Unsubscribe when we're done.
   */
  public componentWillUnmount(): void {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
  }

  /**
   * Fires when the back button is pressed on android.
   */
  public onBackPress = (): boolean => {
    // grab the current route
    const routeName = this.props.navigationStore.findCurrentRoute().routeName

    // are we allowed to exit?
    if (this.props.canExit(routeName)) {
      // let the system know we've not handled this event
      return false
    }

    // we can't exit, so let's turn this into a back action
    this.props.navigationStore.dispatch(NavigationActions.back())

    return true // let the system know we've handled this event
  }

  /**
   * Renders the children or nothing if they weren't passed.
   */
  public render(): React.ReactNode {
    return this.props.children
  }
}
