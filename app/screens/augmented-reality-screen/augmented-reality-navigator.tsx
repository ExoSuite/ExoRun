import { AugmentedRealityScreen } from "@screens/augmented-reality-screen/augmented-reality-screen"
import { ReactViroConfig } from "@utils/react-viro-cfg"
import React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { ViroARSceneNavigator } from "react-viro"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"

export interface IAugmentedRealityNavigatorProps extends NavigationScreenProps<{}> {
}

const FULL: ViewStyle = {
  flex: 1
}

/**
 * AugmentedRealityNavigator will handle multiple AR screens
 */
export class AugmentedRealityNavigator extends React.Component<IAugmentedRealityNavigatorProps> {

  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator()
  }

  // tslint:disable-next-line prefer-function-over-method
  public render(): React.ReactNode {

    return (
      <ViroARSceneNavigator
        style={FULL}
        apiKey={ReactViroConfig.API_KEY}
        initialScene={{ scene: AugmentedRealityScreen }}
      />
    )
  }
}
