import { Dimensions } from "react-native"
import { getStatusBarHeight } from "react-native-status-bar-height"

// tslint:disable-next-line
const { height, width } = Dimensions.get("window")

/**
 * define screen constants
 * @class Screen
 */
export class Screen {
  public static Height = height
  public static Width = width

  public static get middleHeight(): number {
    return Screen.Height / 2
  }

  public static get middleWidth(): number {
    return Screen.Width / 2
  }

  public static get getStatusBarHeight(): number {
    return getStatusBarHeight(true)
  }
}
