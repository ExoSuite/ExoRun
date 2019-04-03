import { ViewStyle } from "react-native"
import { IconName } from "@fortawesome/fontawesome-common-types"
import { FA5Style } from "react-native-vector-icons/FontAwesome5Pro"

export type FontAwesome5IconVariants = keyof typeof FA5Style;
export type FontAwesomeIconNames = IconName

export interface IFontawesomeIconProps {

  /**
   * color of icon
   */
  color?: string
  /**
   * name of the font awesome icon
   */
  name: FontAwesomeIconNames

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
  type?: FontAwesome5IconVariants
}
