import { translate } from "@i18n"
import { color, spacing, typography } from "@theme"
import { reduce } from "ramda"
import * as React from "react"
import { TextInput, TextStyle, View, ViewStyle } from "react-native"
import { Text } from "../text"
import { ITextFieldProps } from "./text-field.props"

// the base styling for the container
const CONTAINER: ViewStyle = {
  paddingVertical: spacing[3],
}

// the base styling for the TextInput
const INPUT: TextStyle = {
  fontFamily: typography.primary,
  color: color.text,
  minHeight: 44,
  fontSize: 18,
  borderRadius: 10,
  paddingHorizontal: 5,
  backgroundColor: color.palette.white,
}

// currently we have no presets, but that changes quickly when you build your app.
const PRESETS: { [name: string]: ViewStyle } = {
  default: {},
  loginScreen: {
    width: "100%",
    borderBottomColor: color.palette.lighterGrey,
    borderBottomWidth: 0.5,
    backgroundColor: "transparent",
  },
  transparentInput: {
    backgroundColor: "transparent",
  },
}

const enhance = (style: ViewStyle, styleOverride: ViewStyle | ViewStyle[]): ViewStyle => {
  if (Array.isArray(styleOverride)) {
    return reduce((acc: Object, term: Object) => {
      return { ...acc, ...term }
    }, style, styleOverride)
  }

  return {
    ...style,
    ...styleOverride,
  }
}

/**
 * A component which has a label and an input together.
 */
export class TextField extends React.Component<ITextFieldProps> {
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
