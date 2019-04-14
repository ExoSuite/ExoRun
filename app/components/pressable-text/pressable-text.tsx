import { TextPresets } from "@components/text/text.presets"
import * as React from "react"
import { GestureResponderEvent, TextStyle, TouchableOpacity } from "react-native"
import { Text } from "../text"

export interface IPressableTextProps {

  preset: TextPresets

  /**
   * An optional style override useful for padding & margin.
   */
  style?: TextStyle,

  text?: string,
  /**
   * Text which Is looked up via i18n.
   */
  tx?: string

  onPress(event: GestureResponderEvent): void;
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
// tslint:disable-next-line: typedef
export function PressableText(props: IPressableTextProps) {
  // grab the props
  const { tx, text, preset, onPress, style } = props

  return (
    <TouchableOpacity onPress={onPress}>
      <Text tx={tx} text={text} style={style} preset={preset}/>
    </TouchableOpacity>
  )
}
