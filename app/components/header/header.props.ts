import { TextStyle, ViewStyle } from "react-native"
import { FontAwesome5IconVariants, FontAwesomeIconNames } from "@components/fontawesome-icon/font-awesome-icon.props"

export interface IHeaderProps {

  /**
   * header non-i18n
   */
  headerText?: string
  /**
   * Main header
   */
  headerTx?: string

  /**
   * Icon that should appear on the left
   */
  leftIcon?: FontAwesomeIconNames
  leftIconColor?: string
  leftIconSize?: number
  leftIconStyle?: ViewStyle
  leftIconType?: FontAwesome5IconVariants
  /**
   * Icon that should appear on the right
   */
  rightIcon?: FontAwesomeIconNames
  rightIconColor?: string
  rightIconSize?: number
  rightIconStyle?: ViewStyle
  rightIconType?: FontAwesome5IconVariants
  /**
   * Container style overrides.
   */
  style?: ViewStyle
  /**
   * Title style overrides.
   */
  titleStyle?: TextStyle

  /**
   * What happens when you press the left icon
   */
  onLeftPress?(): void

  /**
   * What happens when you press the right icon
   */
  onRightPress?(): void
}
