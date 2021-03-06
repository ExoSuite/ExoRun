import * as React from "react"
import { TextInput, TextStyle, View, ViewStyle } from "react-native"
import { color, spacing, typography } from "@theme"
import { translate } from "@i18n"
import { Text } from "../text"
import { ITextFieldProps } from "./text-field.props"
import { flatten, mergeAll } from "ramda"

// the base styling for the container
const CONTAINER: ViewStyle = {
  paddingVertical: spacing[3]
}

// the base styling for the TextInput
const INPUT: TextStyle = {
  fontFamily: typography.primary,
  color: color.text,
  minHeight: 44,
  fontSize: 18,
  backgroundColor: color.palette.white
}

// currently we have no presets, but that changes quickly when you build your app.
const PRESETS: { [name: string]: ViewStyle } = {
  default: {},
  auth: {
    flex: 1
  },
  transparentInput: {
    backgroundColor: "transparent"
  }
}

const enhance = (style: object, styleOverride: object): object => {
  return mergeAll(flatten([style, styleOverride]))
}

/**
 * A component which has a label and an input together.
 */
export class TextField extends React.PureComponent<ITextFieldProps> {
  public render(): React.ReactNode {
    const {
      placeholderTx,
      placeholder,
      labelTx,
      label,
      preset = "default",
      style: styleOverride,
      inputStyle: inputStyleOverride,
      forwardedRef,
      ...rest
    } = this.props
    let containerStyle: ViewStyle = { ...CONTAINER, ...PRESETS[preset] }
    containerStyle = enhance(containerStyle, styleOverride)

    let inputStyle: TextStyle = INPUT
    inputStyle = enhance(inputStyle, inputStyleOverride)
    const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder

    return (
      <View style={containerStyle}>
        <Text preset="fieldLabel" tx={labelTx} text={label}/>
        <TextInput
          placeholder={actualPlaceholder}
          placeholderTextColor={color.palette.lighterGrey}
          underlineColorAndroid={color.transparent}
          {...rest}
          style={inputStyle}
          ref={forwardedRef}
        />
      </View>
    )
  }
}
