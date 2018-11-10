import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

export class Screen {
  static Width = width;
  static Height = height;
}
