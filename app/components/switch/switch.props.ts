import { ViewStyle } from "react-native"

export interface ISwitchProps {

  /**
   * A style override to apply to the container.  Useful for margins and paddings.
   */
  style?: ViewStyle | ViewStyle[]

  /**
   * Additional thumb styling when off.
   */
  thumbOffStyle?: ViewStyle | ViewStyle[]

  /**
   * Additional thumb styling when on.
   */
  thumbOnStyle?: ViewStyle | ViewStyle[]

  /**
   * Additional track styling when off.
   */
  trackOffStyle?: ViewStyle | ViewStyle[]

  /**
   * Additional track styling when on.
   */
  trackOnStyle?: ViewStyle | ViewStyle[]
  /**
   * On or off.
   */
  value?: boolean
  /**
   * Fires when the on/off switch triggers.
   *
   * @param newValue The new value we're switching to.
   */
  // tslint:disable-next-line no-flag-args
  onToggle?(newValue: boolean): void;
}
