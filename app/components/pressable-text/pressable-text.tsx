import * as React from "react"
import { TextStyle, TouchableOpacity } from "react-native"
import { Text } from "../text"
import { TextPresets } from "@components/text/text.presets"

export interface PressableTextProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  text?: string,

  /**
   * An optional style override useful for padding & margin.
   */
  style?: TextStyle,

  onPress: (e) => void,

  preset: TextPresets
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function PressableText(props: PressableTextProps) {
  // grab the props
  const { tx, text, preset, onPress, style } = props

  return (
    <TouchableOpacity onPress={onPress}>
      <Text tx={tx} text={text} style={style} preset={preset} />
    </TouchableOpacity>
  )
}
