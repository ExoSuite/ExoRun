import * as React from "react"
import { Image, ImageSourcePropType, ImageStyle } from "react-native"
import * as RNFS from "react-native-fs"
import shorthash from "shorthash";
import { Platform } from "@services/device"

export interface ICachedImageProps {
  defaultUrl: string
  style: ImageStyle
  uri: string,
}

interface ICachedImageState {
  source: ImageSourcePropType
}

/**
 * The CachedImage will handle the load of image an will cache the image.
 */
export class CachedImage extends React.Component<ICachedImageProps, ICachedImageState> {

  public state: ICachedImageState = { source: null }

  constructor(props: ICachedImageProps) {
    super(props)
    this.state.source = { uri: props.defaultUrl }
  }

  private downloadFile(uri: string, path: string): void {
    const { defaultUrl } = this.props;
    RNFS.downloadFile({ fromUrl: uri, toFile: path }).promise
      .then(() => {
        this.loadFile(path)
      })
      .catch(() => {
        this.loadFile(defaultUrl)
      })
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
    const { style } = this.props;

    return(
      <Image style={style} source={this.state.source} />
    );
  }

}
