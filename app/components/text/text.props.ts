import * as React from "react"
import { TextProps as TextProperties, TextStyle } from "react-native"
import { TextPresets } from "./text.presets"

export interface ITextProps extends TextProperties {
  /**
   * Children components.
   */
  children?: React.ReactNode

  /**
   * One of the different types of text presets.
   */
  preset?: TextPresets

  /**
   * An optional style override useful for padding & margin.
   */
  style?: TextStyle | TextStyle[]

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * Text which is looked up via i18n.
   */
  tx?: string
}
