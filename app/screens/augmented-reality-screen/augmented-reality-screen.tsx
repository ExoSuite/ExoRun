import { color } from "@theme"
import { action, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import {
  ViroARScene, ViroConstants, ViroText, ViroAmbientLight,
  Viro3DObject, ViroARCamera, ViroBox, ViroButton, ViroARPlaneSelector, ViroNode,
} from "react-viro"
import autobind from "autobind-decorator"

export interface IAugmentedRealityScreenProps extends NavigationScreenProps<{}> {
}

import { noop } from "lodash-es"

const ROOT: ViewStyle = {
  backgroundColor: color.background
}

/**
 * AugmentedRealityScreen will ExoRun augmented reality
 */
@observer
export class AugmentedRealityScreen extends React.Component<IAugmentedRealityScreenProps> {
  @observable private Active = true

  @observable private AnimationName = "Idle"
  @observable private Speed = "RunFast";
  @observable private text = "Initializing AR..."

  @action.bound
  // tslint:disable-next-line:prefer-function-over-method
  private AdaptSpeed(scrollPosition: number[], source: number[]): void {
    console.log(scrollPosition[0] + scrollPosition[1]);
  }

  @action.bound
  private onInitialized(state: string, reason: string): void {
    if (state === ViroConstants.TRACKING_NORMAL) {
      this.AnimationName = "Idle"
      this.text = "Hello World!"
    }
  }

  private setButton() : any {
    return(
      <ViroARCamera>
        <ViroButton
          source={require("../../assets/3Dasset/BBackground.png")}
          position={[-2, -4, -10]}
          height={1}
          width={1.5}
          onClick={this.switchModel}
        />
        <ViroButton
          source={require("../../assets/3Dasset/BBackgroundSpeed.png")}
          position={[2, -4, -10]}
          height={1}
          width={1.5}
          onClick={this.switchSpeed}
        />
      </ViroARCamera>
    )
  }

  private setCheckpoint(): React.ReactNode {
    if (this.Active) {
      return(
        <ViroNode position={[0, -1, -1]} dragType="FixedToPlane" onDrag={noop} >
          <Viro3DObject
            source={require("../../assets/3Dasset/CheckPointWithAnim.vrx")}
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
      )
    }

    return null
  }

  private setRunner() : any {
    if (!this.Active) {
      return(
        <ViroNode position={[0, -1, -1]} dragType="FixedToPlane" onDrag={noop} >
          <Viro3DObject
            source={require("../../assets/3Dasset/IdleAndRunFastAndSlow.vrx")}
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
        </ViroNode>
      )
    }
  }

  @action.bound
  private SwitchAnimation(): void {
    // tslint:disable-next-line:prefer-conditional-expression
    if (this.AnimationName === "Idle") {
      this.AnimationName = this.Speed;
    }  else {
      this.AnimationName = "Idle";
    }
  }

  @action.bound
  private switchModel(): void {
    this.Active = !this.Active;
  }
  @action.bound
  private switchSpeed() : void {
    if (this.Speed === "RunFast") {
      this.Speed = "RunSlow";
      if (this.AnimationName !== "Idle") {
        this.AnimationName = this.Speed;
      }
    } else if (this.Speed === "RunSlow") {
      this.Speed = "RunFast";
      if (this.AnimationName !== "Idle") {
        this.AnimationName = this.Speed;
      }
    }
  }

  public render(): React.ReactNode {

    return (
      <ViroARScene style={ROOT} onTrackingUpdated={this.onInitialized}>
        <ViroAmbientLight color="#ffffff" />
        {this.setCheckpoint()}
        {this.setRunner()}
        {this.setButton()}
      </ViroARScene>
    )
  }
}
