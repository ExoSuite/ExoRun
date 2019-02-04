import { ViewStyle, TextStyle } from "react-native"
import { FontawesomeIconTypes } from "@components/fontawesome-icon"

export interface HeaderProps {
  /**
   * Main header
   */
  headerTx?: string

  /**
   * header non-i18n
   */
  headerText?: string

  /**
   * Icon that should appear on the left
   */
  leftIcon?: string
  leftIconColor?: string
  leftIconSize?: number
  leftIconType?: FontawesomeIconTypes
  leftIconStyle?: ViewStyle

  /**
   * What happens when you press the left icon
   */
  onLeftPress?(): void

  /**
   * Icon that should appear on the right
   */
  rightIcon?: string
  rightIconColor?: string
  rightIconSize?: number
  rightIconType?: FontawesomeIconTypes
  rightIconStyle?: ViewStyle

  /**
   * What happens when you press the right icon
   */
  onRightPress?(): void

  /**
   * Container style overrides.
   */
  style?: ViewStyle

  /**
   * Title style overrides.
   */
  titleStyle?: TextStyle
}
