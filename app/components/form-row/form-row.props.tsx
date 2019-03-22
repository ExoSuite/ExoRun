import * as React from "react"
import { ViewStyle } from "react-native"
import { FormRowPresets } from "./form-row.presets"

/**
 * The properties you can pass to FormRow.
 */
export interface IFormRowProps {
  /**
   * Children components.
   */
  children?: React.ReactNode

  /**
   * The type of border.
   */
  preset: FormRowPresets

  /**
   * Override the container style... useful for margins and padding.
   */
  style?: ViewStyle | ViewStyle[]
}
