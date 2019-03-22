import { FontawesomeIconTypes } from "@components/fontawesome-icon/fontawesome-icon"
import { ViewStyle } from "react-native"

export interface IFontawesomeIconProps {

  /**
   * color of icon
   */
  color?: string
  /**
   * name of the font awesome icon
   */
  name: string

  /**
   * size of icon
   */
  size?: number

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle

  /**
   * type of icon
   */
  type?: FontawesomeIconTypes
}
