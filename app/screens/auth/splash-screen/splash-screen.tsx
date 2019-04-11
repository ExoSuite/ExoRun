import { action, observable, runInAction } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Animated, StyleSheet, View, ViewStyle } from "react-native"

import { Screen } from "@services/device"
import { ILoaderProps } from "@screens/auth"

const FULL_SCREEN: ViewStyle = {
  flex: 1
}

/**
 * SplashScreen will handle the animation when we launch the app
 */
@observer
export class SplashScreen extends React.Component<ILoaderProps> {

  public animation: Animated.Value = new Animated.Value(0)

  @observable public appLoaded = false

  public animate(): void {
    const { animation } = this
    Animated.timing(animation, {
      toValue: 100,
      duration: 1250,
      useNativeDriver: true
    }).start(() => runInAction(() => this.appLoaded = true))
  }

  // tslint:disable-next-line no-feature-envy
  public render(): React.ReactNode {
    const { children, backgroundColor, imageProperties, imageSource } = this.props
    const { animation, appLoaded } = this

    const opacityClearToVisible = {
      opacity: animation.interpolate({
        inputRange: [0, 15, 30],
        outputRange: [0, 0, 1],
        extrapolate: "clamp"
      })
    }

    const appScale = {
      transform: [
        {
          scale: animation.interpolate({
            inputRange: [0, 7, 100],
            outputRange: [1.1, 1.03, 1]
          })
        }
      ]
    }

    const transform = {
      transform: [
        {
          scale: animation.interpolate({
            inputRange: [0, 10, 100],
            outputRange: [1, 0.8, 70]
          })
        }
      ]
    }

    const solidStyle = {
      position: "absolute",
      height: imageProperties.height,
      width: imageProperties.width,
      top: (-imageProperties.height / 2) + (Screen.Height / 2),
      left: (-imageProperties.width / 2) + (Screen.Width / 2),
      ...transform
    }

    const fullScreenBackgroundLayer = appLoaded ? null : (
      <View style={[StyleSheet.absoluteFill, { backgroundColor }]}/>
    )

    return (
      <View style={FULL_SCREEN}>
        {fullScreenBackgroundLayer}
        <Animated.Image source={imageSource} style={solidStyle}/>
        <Animated.View style={[FULL_SCREEN, appScale, opacityClearToVisible]}>
          {children}
        </Animated.View>
      </View>
    )
  }

  @action
  public reset(): void {
    this.appLoaded = false
    this.animation = new Animated.Value(0)
  }
}
