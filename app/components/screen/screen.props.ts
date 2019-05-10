import * as React from "react"
import { ViewStyle } from "react-native"
import { KeyboardOffsets, ScreenPresets } from "./screen.presets"

export interface IScreenProps {

  /**
   * An optional background color
   */
  backgroundColor?: string
  /**
   * Children components.
   */
  children?: React.ReactNode

  /**
   * By how much should we offset the keyboard? Defaults to none.
   */
  keyboardOffset?: KeyboardOffsets

  /**
   * One of the different types of presets.
   */
  preset?: ScreenPresets

  /**
   * An optional status bar setting. Defaults to light-content.
   */
  statusBar?: "light-content" | "dark-content"

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle,

  /**
   * Should we not wrap in SafeAreaView? Defaults to false.
   */
  unsafe?: boolean
}
