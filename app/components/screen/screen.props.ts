import * as React from "react"
import { ViewStyle } from "react-native"
import { ScreenPresets } from "./screen.presets"

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
   * One of the different types of presets.
   */
  preset?: ScreenPresets

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}
