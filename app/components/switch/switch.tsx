import * as React from "react"
import { Animated, Easing, TouchableWithoutFeedback, ViewStyle } from "react-native"
import { color } from "@theme"
import { ISwitchProps } from "./switch.props"
import { reduce } from "ramda"

// dimensions
const THUMB_SIZE = 30
const WIDTH = 56
const MARGIN = 2
const OFF_POSITION = -0.5
const ON_POSITION = WIDTH - THUMB_SIZE - MARGIN
const BORDER_RADIUS = THUMB_SIZE * 3 / 4

// colors
const ON_COLOR = color.primary
const OFF_COLOR = color.palette.offWhite
const BORDER_ON_COLOR = ON_COLOR
const BORDER_OFF_COLOR = "rgba(0, 0, 0, 0.1)"

// animation
const DURATION = 250

// the track always has these props
const TRACK: ViewStyle = {
  height: THUMB_SIZE + MARGIN,
  width: WIDTH,
  borderRadius: BORDER_RADIUS,
  borderWidth: MARGIN / 2,
  backgroundColor: color.background
}

// the thumb always has these props
const THUMB: ViewStyle = {
  position: "absolute",
  width: THUMB_SIZE,
  height: THUMB_SIZE,
  borderColor: BORDER_OFF_COLOR,
  borderRadius: THUMB_SIZE / 2,
  borderWidth: MARGIN / 2,
  backgroundColor: color.background,
  shadowColor: BORDER_OFF_COLOR,
  shadowOffset: { width: 1, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 2,
  elevation: 2
}

const enhance = (style: Object, newStyles: Object): ViewStyle => {
  if (Array.isArray(newStyles)) {
    return reduce((acc: Object, term: Object) => {
      return { ...acc, ...term }
    }, style, newStyles)
  }

  return {
    ...style,
    ...newStyles
  } as ViewStyle
}

interface ISwitchState {
  timer: Animated.Value
}

/**
 * * Switch Component with ability to toggle the value on tap.
 */
export class Switch extends React.PureComponent<ISwitchProps, ISwitchState> {
  public state: ISwitchState = {
    timer: new Animated.Value(this.props.value ? 1 : 0)
  }

  /**
   * Fires when we tap the touchable.
   */
  private readonly handlePress = (): void => {
    if (this.props.onToggle) {
      this.props.onToggle(!this.props.value)
    }
  }

  public componentWillReceiveProps(newProps: ISwitchProps): void {
    if (newProps.value !== this.props.value) {
      this.startAnimation(newProps.value)
    }
  }

  /**
   * Render the component.
   */
  public render(): React.ReactNode {
    const translateX = this.state.timer.interpolate({
      inputRange: [0, 1],
      outputRange: [OFF_POSITION, ON_POSITION]
    })

    const style = enhance({}, this.props.style)

    let trackStyle = TRACK
    trackStyle = enhance(trackStyle, {
      backgroundColor: this.props.value ? ON_COLOR : OFF_COLOR,
      borderColor: this.props.value ? BORDER_ON_COLOR : BORDER_OFF_COLOR
    })
    trackStyle = enhance(trackStyle,
      this.props.value ? this.props.trackOnStyle : this.props.trackOffStyle
    )

    let thumbStyle = THUMB
    thumbStyle = enhance(thumbStyle, {
      transform: [{ translateX }]
    })
    thumbStyle = enhance(thumbStyle,
      this.props.value ? this.props.thumbOnStyle : this.props.thumbOffStyle
    )

    return (
      <TouchableWithoutFeedback onPress={this.handlePress} style={style}>
        <Animated.View style={trackStyle}>
          <Animated.View style={thumbStyle}/>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }

  // tslint:disable-next-line no-flag-args
  public startAnimation(newValue: boolean): void {
    const toValue = newValue ? 1 : 0
    const easing = Easing.out(Easing.circle)
    Animated.timing(this.state.timer, {
      toValue,
      duration: DURATION,
      easing,
      useNativeDriver: true
    }).start()
  }
}
