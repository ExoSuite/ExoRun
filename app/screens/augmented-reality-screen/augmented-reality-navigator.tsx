import React from "react"
import { ViewStyle } from "react-native"
import { ViroARSceneNavigator } from "react-viro"
import { AugmentedRealityScreen } from "@screens/augmented-reality-screen/augmented-reality-screen"
import { ReactViroConfig } from "@utils/react-viro-cfg"
import { NavigationScreenProps } from "react-navigation"

export interface AugmentedRealityNavigatorProps extends NavigationScreenProps<{}> {
}

const FULL: ViewStyle = {
  flex: 1,
}

export class AugmentedRealityNavigator extends React.Component<AugmentedRealityNavigatorProps> {

  static navigationOptions = {
    header: null,
  }

  render(): React.ReactNode {
    const { navigation } = this.props

    return (
      <ViroARSceneNavigator
        style={FULL}
        apiKey={ReactViroConfig.API_KEY}
        initialScene={{ scene: AugmentedRealityScreen }}
      />
    )
  }
}
