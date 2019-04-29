import * as React from "react"
import { reduce } from "ramda"
import { TouchableOpacity } from "react-native"
import { Text } from "../text"
import { textPresets, viewPresets } from "./button.presets"
import { IButtonProps } from "./button.props"

/**
 * For your text displaying needs.
 *
 * This component Is a HOC over the built-in React Native one.
 */
export function Button(props: IButtonProps): React.ReactElement {
  // grab the props
  const { preset = "primary", tx, text, style: styleOverride, textStyle: textStyleOverride, children, ...rest } = props

  // assemble the style
  const viewPresetToUse = viewPresets[preset] || viewPresets.primary
  const textPresetToUse = textPresets[preset] || textPresets.primary

  let viewStyle
  if (Array.isArray(styleOverride)) {
    viewStyle = reduce((acc: Object, term: Object) => {
      return { ...acc, ...term }
    }, viewPresetToUse, styleOverride)
  } else {
    viewStyle = { ...viewPresetToUse, ...styleOverride }
  }

  let textStyle
  if (Array.isArray(textStyleOverride)) {
    textStyle = reduce((acc: Object, term: Object) => {
      return { ...acc, ...term }
    }, textPresetToUse, textStyleOverride)
  } else {
    textStyle = { ...textPresetToUse, ...textStyleOverride }
  }

  const content = children || <Text tx={tx} text={text} style={textStyle}/>

  return (
    <TouchableOpacity style={viewStyle} {...rest}>
      {content}
    </TouchableOpacity>
  )
}
