import {Platform} from 'react-native'

// create url for static retrieve of assets
export function AssetLocator (assetName: string, fileExtension: FileExtension = FileExtension.PNG) {
    return {uri: Platform.OS === 'ios' ? assetName : `asset:/custom/${assetName}.${fileExtension}`}
}

export enum FileExtension {
    PNG = 'png',
    JPG = 'jpg'
}
