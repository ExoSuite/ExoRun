import { AugmentedRealityScreen } from "@screens/augmented-reality-screen/augmented-reality-screen"
import { ReactViroConfig } from "@utils/react-viro-cfg"
import React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProp } from "react-navigation"
import { ViroARSceneNavigator } from "react-viro"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import autobind from "autobind-decorator"

export interface IAugmentedRealityNavigatorProps extends NavigationScreenProp<{}> {
}

const FULL: ViewStyle = {
  flex: 1
}

/**
 * AugmentedRealityNavigator will handle multiple AR screens
 */
export class AugmentedRealityNavigator extends React.Component<IAugmentedRealityNavigatorProps> {

  private viroArSceneRef: ViroARSceneNavigator;

  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator()
  }

  @autobind
  private setviroArSceneRef(ref: ViroARSceneNavigator) {
    this.viroArSceneRef = ref;
  }

  // tslint:disable-next-line prefer-function-over-method
  public render(): React.ReactNode {
    return (
      <ViroARSceneNavigator
        style={FULL}
        ref={this.setviroArSceneRef}
        apiKey={ReactViroConfig.API_KEY}
        initialScene={{ scene: AugmentedRealityScreen }}
      />
    )
  }
}
