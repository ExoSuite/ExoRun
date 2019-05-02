import * as React from "react"
import { ImageBackground, ImageProps, ImageSourcePropType, ImageStyle } from "react-native"
import * as RNFS from "react-native-fs"
import shorthash from "shorthash";
import { Platform } from "@services/device"

export interface ICachedImageProps {
  style: ImageStyle
  uri: string,
}

interface ICachedImageState {
  source: ImageSourcePropType
}

/**
 * The CachedImage will handle the load of image an will cache the image.
 */
export class CachedBackgroundImage extends React.Component<ICachedImageProps & Partial<ImageProps>, ICachedImageState> {

  public state: ICachedImageState = { source: null }

  private downloadFile(uri: string, path: string): void {
    RNFS.downloadFile({ fromUrl: uri, toFile: path }).promise
      .then(() => {
        this.loadFile(path)
      })
      .catch()
  }

  private loadFile(path: string): void {
    this.setState({ source: { uri: path } })
  }

  public componentDidMount(): void {
    const { uri } = this.props;
    const name = shorthash.unique(uri);
    const extension = Platform.Android ? "file://" : ""
    const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
    RNFS.exists(path).then((exists: any) => {
      if (exists) {
        this.loadFile(path);
      } else {
        this.downloadFile(uri, path) ;
      }
    }).catch()
  }

  public render(): React.ReactNode {
    const { style, ...rest } = this.props;

    return(
      <ImageBackground style={style} source={this.state.source} {...rest}/>
    );
  }

}
