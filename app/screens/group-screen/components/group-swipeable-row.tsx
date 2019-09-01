import React from "react"
import { Animated, StyleSheet, ViewStyle } from "react-native"
import Swipeable from "react-native-gesture-handler/Swipeable";
import autobind from "autobind-decorator"
import { RectButton } from "react-native-gesture-handler";
import { IFontawesomeIconProps } from "@components/fontawesome-icon/font-awesome-icon.props"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"

const AnimatedIcon = Animated.createAnimatedComponent(
  class Icon extends React.PureComponent<IFontawesomeIconProps> {
    public render(): React.ReactNode {
      return (
        <FontAwesome5Icon {...this.props}/>
      )
    }
  }
);

export interface IGroupSwipeableRowProps {
  children: React.ReactNode
  style: ViewStyle
}

const styles = StyleSheet.create({
  leftAction: {
    backgroundColor: "#388e3c",
    justifyContent: "center",
    flex: 1
  },
  actionIcon: {
    width: 30,
    marginHorizontal: 10,
  },
  rightAction: {
    alignItems: "flex-end",
    backgroundColor: "#dd2c00",
    justifyContent: "center",
    flex: 1
  },
});

/**
 * see: https://kmagiera.github.io/react-native-gesture-handler/docs/component-swipeable.html
 * example: https://github.com/kmagiera/react-native-gesture-handler/blob/master/Example/swipeable/index.js
 */
@autobind
export class GroupSwipeableRow extends React.Component<IGroupSwipeableRowProps> {

  private swipeableRef: Swipeable

  private closeRow(): void {
    this.swipeableRef.close()
  }

  private renderLeftActions(progress: any, dragX: Animated.Value): React.ReactNode {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return (
      <RectButton style={styles.leftAction} onPress={this.closeRow}>
        <AnimatedIcon
          name="archive"
          size={30}
          color="#fff"
          style={[styles.actionIcon, { transform: [{ scale }] }]}
        />
      </RectButton>
    );
  }

  private renderRightActions(progress: any, dragX: Animated.Value): React.ReactNode {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <RectButton style={styles.rightAction} onPress={this.closeRow}>
        <AnimatedIcon
          name="trash"
          size={30}
          color="#fff"
          style={[styles.actionIcon, { transform: [{ scale }] }]}
        />
      </RectButton>
    );
  }

  private setSwipeableRef(ref: Swipeable): void {
    this.swipeableRef = ref
  }

  public render(): React.ReactNode {
    const { children, style } = this.props;

    return (
      <Swipeable
        ref={this.setSwipeableRef}
        friction={2}
        leftThreshold={80}
        rightThreshold={40}
        renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}
        containerStyle={style}
      >
        {children}
      </Swipeable>
    )
  }
}
