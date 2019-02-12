import { Platform as RNPlatform } from "react-native"


export class Platform {
  static iOS = RNPlatform.OS === "ios"
  static Android = RNPlatform.OS === "android"
}
