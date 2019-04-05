import { Platform as RNPlatform } from "react-native"

/**
 * define platforms constants
 * @class Platform
 */
export class Platform {
  public static Android = RNPlatform.OS === "android"
  public static iOS = RNPlatform.OS === "ios"
}
