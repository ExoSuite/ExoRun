import { Dimensions } from "react-native"

// tslint:disable-next-line
const { height, width } = Dimensions.get("window")

/**
 * define screen constants
 * @class Screen
 */
export class Screen {
  public static Height = height
  public static Width = width

  public static middleHeight(): number {
    return Screen.Height / 2
  }

  public static middleWidth(): number {
    return Screen.Width / 2
  }
}
