import * as React from "react"
import { ViewStyle } from "react-native"
import { ViroARScene, ViroConstants, ViroText } from "react-viro"
import { NavigationScreenProps } from "react-navigation"
import { color } from "@theme"
import { observer } from "mobx-react/native"
import autobind from "autobind-decorator"
import { observable, action } from "mobx"

export interface AugmentedRealityScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background
}

@observer
export class AugmentedRealityScreen extends React.Component<AugmentedRealityScreenProps, {}> {

  @observable private text: string = "Initializing AR..."

  @action.bound
  _onInitialized(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.text = "Hello World!"
    } else if (state == ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }

  render() {
    const { text } = this
    console.tron.log("WAHT")

    return (
      <ViroARScene style={ROOT} onTrackingUpdated={this._onInitialized}>
        <ViroText text={text}
                  scale={[.5, .5, .5]}
                  position={[0, 0, -1]}
                  style={{
                    fontSize: 30,
                    color: "#ffffff",
                    textAlignVertical: "center",
                    textAlign: "center"
                  }}
        />
      </ViroARScene>
    )
  }
}
