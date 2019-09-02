import { color } from "@theme"
import { action, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { View, ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { ViroARScene, ViroConstants, ViroText, ViroAmbientLight,
          Viro3DObject, ViroARCamera, ViroBox, ViroButton, ViroARPlaneSelector, ViroNode } from "react-viro"
import { TextInput } from "react-native-paper"

export interface IAugmentedRealityScreenProps extends NavigationScreenProps<{}> {
}

const Animation = require("../../assets/3Dasset/IdleAndRun.vrx");
const AnimationRun = require("../../assets/3Dasset/IdleAndRunFastAndSlow.vrx");
const Arrow = require("../../assets/3Dasset/Arrow.vrx");
const CheckPoint = require("../../assets/3Dasset/CheckPointWithAnim.vrx");
const ROOT: ViewStyle = {
  backgroundColor: color.background
}

/**
 * AugmentedRealityScreen will ExoRun augmented reality
 */
@observer
export class AugmentedRealityScreen extends React.Component<IAugmentedRealityScreenProps> {

  @observable private AnimationName = "Idle"
  @observable private Speed = "RunFast";
  @observable private text = "Initializing AR..."

  @action.bound
  private AdaptSpeed(scrollPosition: any, source: any): void {
    console.log(scrollPosition[0] + scrollPosition[1]);
  }

  @action.bound
  private onInitialized(state: string, reason: string): void {
    if (state === ViroConstants.TRACKING_NORMAL) {
      this.AnimationName = "Idle"
      this.text = "Hello World!"
    }
  }

  @action.bound
  private SwitchAnimation(): void {
    if (this.AnimationName === "Idle") {
      this.AnimationName = this.Speed;
    }  else {
      this.AnimationName = "Idle";
    }
  }
  @action.bound
  private switchSpeed() : void {
    if (this.Speed === "RunFast") {
      this.Speed = "RunSlow";
      if (this.AnimationName !== "Idle") {
        this.AnimationName = this.Speed;
      }
    }
    else if (this.Speed === "RunSlow") {
      this.Speed = "RunFast";
      if (this.AnimationName !== "Idle") {
        this.AnimationName = this.Speed;
      }
    }
  }

  public render(): React.ReactNode {
    const { text } = this

    return (
      <ViroARScene style={ROOT} onTrackingUpdated={this.onInitialized}>
        <ViroAmbientLight color="#ffffff" />
        <ViroNode position={[0, -1, -1]} dragType="FixedToPlane" onDrag={( )=>{}} >
          <Viro3DObject
            source={CheckPoint}
            highAccuracyEvents
            position={[0, 0.5, 0]}
            scale={[0.02, 0.02, 0.02]}
            type="VRX"
            animation={{name: "Take 001",
              run: true,
              loop: true,
              interruptible: true}}
          />
        </ViroNode>
        {/*<ViroARCamera>
          <Viro3DObject
            source={Arrow}
            highAccuracyEvents
            position={[0, 0.7, -2.1]}
            scale={[0.1, 0.1, 0.1]}
            rotation={[0, 0, 0]}
            type="VRX"
            transformBehaviors={["billboard"]}
          />
          <Viro3DObject
            source={AnimationRun}
            highAccuracyEvents
            position={[0, -0.8, -3]}
            scale={[0.009, 0.009, 0.009]}
            rotation={[0, 180, 0]}
            type="VRX"
            onClick={this.SwitchAnimation}
            animation={{name: this.AnimationName,
              run: true,
              loop: true,
              interruptible: true}}
          />

          <ViroButton
            source={require("../../assets/3Dasset/BBackground.png")}
            position={[-2, -4, -10]}
            height={1}
            width={1.5}
            onClick={this.SwitchAnimation}
          />
          <ViroButton
            source={require("../../assets/3Dasset/BBackgroundSpeed.png")}
            position={[2, -4, -10]}
            height={1}
            width={1.5}
            onClick={this.switchSpeed}
          />
        </ViroARCamera>*/}
      </ViroARScene>
    )
  }
}
