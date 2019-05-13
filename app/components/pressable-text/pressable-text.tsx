import { TextPresets } from "@components/text/text.presets"
import * as React from "react"
import { GestureResponderEvent, TextStyle, TouchableOpacity } from "react-native"
import { Text } from "../text"
import { ITextProps } from "@components/text/text.props"

export interface IPressableTextProps extends ITextProps {
  onPress(event: GestureResponderEvent): void;
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function PressableText(props: IPressableTextProps): React.ReactElement {
  // grab the props
  const { tx, text, preset, onPress, style } = props

  return (
    <TouchableOpacity onPress={onPress}>
      <Text tx={tx} text={text} style={style} preset={preset}/>
    </TouchableOpacity>
  )
}
