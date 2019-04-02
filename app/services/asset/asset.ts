import { Platform } from "react-native"

export interface IImageUri {
  uri: string
}

enum FileExtension {
  PNG = "png",
  JPG = "jpg",
  JSON = "json",
}

/**
 * create url for static retrieve of assets
 * @class Asset
 */
class Asset {

  private static _locator(assetName: string, fileExtension: FileExtension): string {
    return Platform.OS === "ios" ? assetName : `asset:/custom/${assetName}.${fileExtension}`
  }

  public static Locator(assetName: string, fileExtension: FileExtension = FileExtension.PNG): IImageUri {
    return { uri: Asset._locator(assetName, fileExtension) }
  }
}

export {
  Asset,
  FileExtension
}
