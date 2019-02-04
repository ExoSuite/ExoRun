import { Platform } from "react-native"

export interface ImageUri {
  uri: string
}

// create url for static retrieve of assets
class Asset {

  private static _locator(assetName: string, fileExtension: FileExtension): string {
    return Platform.OS === "ios" ? assetName : `asset:/custom/${assetName}.${fileExtension}`
  }

  static Locator(assetName: string, fileExtension: FileExtension = FileExtension.PNG): ImageUri {
    return { uri: this._locator(assetName, fileExtension) }
  }

  static LottieLocator(assetName: string): ImageUri {
    return { uri: this._locator(assetName, FileExtension.JSON) }
  }
}

enum FileExtension {
  PNG = "png",
  JPG = "jpg",
  JSON = "json",
}

export {
  Asset,
  FileExtension,
}
