import { FontawesomeIconTypes } from "@components/fontawesome-icon"
import { TextStyle, ViewStyle } from "react-native"

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
  leftIcon?: string
  leftIconColor?: string
  leftIconSize?: number
  leftIconStyle?: ViewStyle
  leftIconType?: FontawesomeIconTypes
  /**
   * Icon that should appear on the right
   */
  rightIcon?: string
  rightIconColor?: string
  rightIconSize?: number
  rightIconStyle?: ViewStyle
  rightIconType?: FontawesomeIconTypes
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
