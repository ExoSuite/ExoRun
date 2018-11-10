import * as React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { observable, runInAction } from "mobx";
import { observer } from "mobx-react";

import { LoaderProps } from "./loader.props";
import { Screen } from "src/services/device";

/**
 */
@observer
export class Loader extends React.Component<LoaderProps> {

  @observable appLoaded: boolean = false;

  animation: Animated.Value = new Animated.Value(0);

  animate() {
    const { animation } = this;
    Animated.timing(animation, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: true
    }).start(() => runInAction(() => this.appLoaded = true));
  }

  render() {
    const {children, backgroundColor, imageProperties , imageSource} = this.props;
    const {animation, appLoaded} = this;

    const opacityClearToVisible = {
      opacity: animation.interpolate({
        inputRange: [0, 15, 30],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp',
      }),
    };

    const appScale = {
      transform: [
        {
          scale: animation.interpolate({
            inputRange: [0, 7, 100],
            outputRange: [1.1, 1.03, 1],
          }),
        },
      ],
    };

    const solidStyle = {
      position: 'absolute',
      height: imageProperties.height,
      width: imageProperties.width,
      top: (-imageProperties.height / 2) + (Screen.Height / 2),
      left: (-imageProperties.width / 2) + (Screen.Width / 2),
      transform: [
        {
          scale: animation.interpolate({
            inputRange: [0, 10, 100],
            outputRange: [1, 0.8, 70],
          }),
        },
      ],
    };

    const fullScreenBackgroundLayer = appLoaded ? null : (
      <View style={[StyleSheet.absoluteFill, {backgroundColor}]} />
    );

    return (
      <View style={styles.fullScreen}>
        {fullScreenBackgroundLayer}
        <Animated.Image source={imageSource} style={solidStyle}/>
        <Animated.View style={[styles.fullScreen, appScale, opacityClearToVisible]}>
          {children}
        </Animated.View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  }
});


