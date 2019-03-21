import * as React from "react"
import { View, ViewStyle } from "react-native"
import { ITextFieldProps, TextField } from "@components/text-field"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { color, spacing } from "@theme"
import merge from "lodash.merge"
import * as Animatable from "react-native-animatable"
import autobind from "autobind-decorator"
import AnimatedLottieView from "lottie-react-native"
import { Lottie } from "@services/lottie"

export enum AnimatedInteractiveInputState {
  SUCCESS,
  LOADING,
  ERROR,
}

export interface IAnimatedInteractiveInputProps {
  inputState?: AnimatedInteractiveInputState
  withBottomBorder?: boolean,
}

const CONTAINER: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center"
}

const BOTTOM_BORDER: ViewStyle = {
  borderBottomColor: color.palette.lighterGrey,
  borderBottomWidth: 0.5
}

const ICON: ViewStyle = {
  marginTop: spacing[3],
}

const NOT_VISIBLE: ViewStyle = {
  opacity: 0,
  scaleX: 0,
  scaleY: 0
}

const VISIBLE: ViewStyle = {
  opacity: 1,
  scaleX: 1,
  scaleY: 1
}

const iconName = {
  [AnimatedInteractiveInputState.SUCCESS]: "check-circle",
  [AnimatedInteractiveInputState.ERROR]: "times-circle"
}

const iconColor = {
  [AnimatedInteractiveInputState.SUCCESS]: color.palette.lightGreen,
  [AnimatedInteractiveInputState.ERROR]: color.palette.angry
}

const isIconWanted = (inputState: AnimatedInteractiveInputState): boolean => {
  return inputState === AnimatedInteractiveInputState.ERROR
    || inputState === AnimatedInteractiveInputState.SUCCESS
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
// tslint:disable-next-line typedef
export class AnimatedInteractiveInput extends React.PureComponent<ITextFieldProps & IAnimatedInteractiveInputProps> {

  private animatedIconRef: Animatable.View

  private animatedIconMorph(nextState: AnimatedInteractiveInputState): void {
    if (this.props.inputState !== nextState) {
      this.animatedIconRef.transition(NOT_VISIBLE, VISIBLE)
    }
  }

  @autobind
  private setAnimatedIconRef(ref: any): void {
    this.animatedIconRef = ref
  }

  public componentWillReceiveProps(
    nextProps: Readonly<ITextFieldProps & IAnimatedInteractiveInputProps>,
    nextContext: any
  ): void {

    console.tron.log(nextProps.inputState === AnimatedInteractiveInputState.LOADING)
    this.animatedIconMorph(nextProps.inputState)
  }

  public render(): React.ReactNode {
    const { withBottomBorder, inputState, ...rest } = this.props

    const containerStyle = {
      ...CONTAINER
    }

    merge(containerStyle, withBottomBorder ? BOTTOM_BORDER : {})

    return (
      <View style={containerStyle}>
        <TextField
          {...rest}
        />

        <Animatable.View ref={this.setAnimatedIconRef} style={NOT_VISIBLE}>
          {
            isIconWanted(inputState) ? (
              <FontawesomeIcon
                style={ICON}
                name={iconName[inputState]}
                type="regular"
                size={25}
                color={iconColor[inputState]}
              />
            ) : (
              <AnimatedLottieView
                source={Lottie.InputLoader}
                loop
                autoPlay
                style={{height: 50, marginLeft: 3}}
              />
            )
          }

        </Animatable.View>
      </View>
    )
  }
}
