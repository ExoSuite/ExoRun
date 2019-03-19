import { ViewStyle } from "react-native"

export interface ICheckboxProps {

  /**
   * Additional fill style. Only visible when checked.
   */
  fillStyle?: ViewStyle | ViewStyle[]

  /**
   * Multiline or clipped single line?
   */
  multiline?: boolean

  /**
   * Additional outline style.
   */
  outlineStyle?: ViewStyle | ViewStyle[]
  /**
   * Additional container style. Useful for margins.
   */
  style?: ViewStyle | ViewStyle[]

  /**
   * The text to display if there isn't a tx.
   */
  text?: string

  /**
   * The i18n lookup key.
   */
  tx?: string

  /**
   * Is the checkbox checked?
   */
  value?: boolean

  /**
   * Fires when the user tabs to change the value.
   */
  // tslint:disable-next-line no-flag-args
  onToggle?(newValue: boolean): void;
}
