import { Screen, Text } from "@components"
import { color } from "@theme"
import { observer } from "mobx-react"
import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
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
 * HomeScreen when an user Is logged in, he will be redirected here.
 */
@observer
export class HomeScreen extends React.Component<IHomeScreenProps> {

  // tslint:disable-next-line: prefer-function-over-method
  public render(): React.ReactNode {

    return (
      <Screen style={ROOT} preset="fixed">
        <Text preset="largeHeaderCentered" text="Welcome to ExoRun!"/>
      </Screen>
    )
  }
}
