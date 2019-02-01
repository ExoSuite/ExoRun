import { Platform } from "react-native"

// create url for static retrieve of assets
class Asset {
  static Locator(assetName: string, fileExtension: FileExtension = FileExtension.PNG) {
    return { uri: Platform.OS === "ios" ? assetName : `asset:/custom/${assetName}.${fileExtension}` }
  }
}

enum FileExtension {
  PNG = "png",
  JPG = "jpg"
}

export {
  Asset,
  FileExtension
}
