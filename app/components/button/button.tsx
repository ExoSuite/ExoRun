import * as React from "react"
import { TouchableOpacity } from "react-native"
import { Text } from "../text"
import { textPresets, viewPresets } from "./button.presets"
import { IButtonProps } from "./button.props"
import { flatten, mergeAll } from "ramda"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: IButtonProps): React.ReactElement {
  // grab the props
  const {
    preset = "primary", textPreset, tx, text,
    style: styleOverride, textStyle: textStyleOverride, children,
    ...rest
  } = props

  const viewStyle = mergeAll(flatten([viewPresets[preset] || viewPresets.primary, styleOverride]))
  const textStyle = mergeAll(flatten([textPresets[textPreset] || textPresets[preset] || textPresets.primary, textStyleOverride]))

  const content = children || <Text tx={tx} text={text} style={textStyle}/>

  return (
    <TouchableOpacity style={viewStyle} {...rest}>
      {content}
    </TouchableOpacity>
  )
}
