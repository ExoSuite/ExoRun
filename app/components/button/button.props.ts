import * as React from "react"
import { TextStyle, TouchableOpacityProps, ViewStyle } from "react-native"
import { ButtonPresetNames } from "./button.presets"

export interface IButtonProps extends TouchableOpacityProps {

  /**
   * One of the different types of text presets.
   */
  children?: React.ReactNode

  /**
   * boolean to disable or enable press on.
   */
  disabled?: boolean

  /**
   * One of the different types of text presets.
   */
  preset?: ButtonPresetNames

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle | ViewStyle[]

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * An optional style override useful for the button text.
   */
  textStyle?: TextStyle | TextStyle[]
  /**
   * Text which is looked up via i18n.
   */
  tx?: string
}
