import { color } from "@theme"
import { action, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { ViroARScene, ViroConstants, ViroText } from "react-viro"

export interface IAugmentedRealityScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background
}

/**
 * AugmentedRealityScreen will ExoRun augmented reality
 */
@observer
export class AugmentedRealityScreen extends React.Component<IAugmentedRealityScreenProps> {

  @observable private text = "Initializing AR..."

  @action.bound
  private onInitialized(state: string, reason: string): void {
    if (state === ViroConstants.TRACKING_NORMAL) {
      this.text = "Hello World!"
    }
  }

  public render(): React.ReactNode {
    const { text } = this

    return (
      <ViroARScene style={ROOT} onTrackingUpdated={this.onInitialized}>
        <ViroText
          text={text}
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -1]}
          style={{ fontSize: 30, color: "#ffffff", textAlignVertical: "center", textAlign: "center" }}
        />
      </ViroARScene>
    )
  }
}
