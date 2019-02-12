import { ViewStyle } from "react-native"
import { FontawesomeIconTypes } from "@components/fontawesome-icon/fontawesome-icon"

export interface FontawesomeIconProps {
  /**
   * name of the font awesome icon
   */
  name: string

  /**
   * type of icon
   */
  type?: FontawesomeIconTypes

  /**
   * color of icon
   */
  color?: string

  /**
   * size of icon
   */
  size?: number

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}
