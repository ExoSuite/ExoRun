import { Platform } from "react-native"

export interface IImageUri {
  uri: string
}

export enum FileExtension {
  PNG = "png",
  JPG = "jpg",
  JSON = "json",
}

/**
 * create url for static retrieve of assets
 * @class Asset
 */
export class Asset {

  public static Locator(assetName: string, fileExtension: FileExtension = FileExtension.PNG): IImageUri {
    return { uri: Asset.NativeLocator(assetName, fileExtension) }
  }

  public static NativeLocator(assetName: string, fileExtension: FileExtension): string {
    return Platform.OS === "ios" ? assetName : `asset:/custom/${assetName}.${fileExtension}`
  }
}
