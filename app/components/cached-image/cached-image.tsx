import * as React from "react"
import { Animated, Image, ImageBackground, ImageProps, ImageSourcePropType } from "react-native"
import * as RNFS from "react-native-fs"
import * as shorthash from "shorthash"
import { Platform } from "@services/device"
import autobind from "autobind-decorator"
import { IRenderFunction } from "@types"
import { noop } from "lodash-es"

interface ICachedImageProps {
  cache?: boolean
  children?: React.ReactNode
  type: CachedImageType
  uri: string,
}

interface ICachedImageState {
  source: ImageSourcePropType
}

export enum CachedImageType {
  ANIMATED_IMAGE = 0,
  BACKGROUND_IMAGE = 1,
  IMAGE = 2
}

/**
 * The CachedImage will handle the load of image an will cache the image.
 */
export class CachedImage extends React.PureComponent<ICachedImageProps & Partial<ImageProps>, ICachedImageState> {

  private readonly renders: IRenderFunction[] = []

  public state: ICachedImageState = { source: null }

  public constructor(props: ICachedImageProps) {
    super(props)
    this.renders[CachedImageType.ANIMATED_IMAGE] = this.animatedImage
    this.renders[CachedImageType.BACKGROUND_IMAGE] = this.imageBackground
    this.renders[CachedImageType.IMAGE] = this.image
  }

  @autobind
  private animatedImage(): React.ReactNode {
    const { style, ...rest } = this.props

    return (
      <Animated.Image style={style} source={this.state.source} {...rest}/>
    )
  }

  private downloadFile(uri: string, path: string): void {
    RNFS.downloadFile({ fromUrl: uri, toFile: path }).promise
      .then(() => {
        this.loadFile(path)
      })
      .catch(noop)
  }

  @autobind
  private image(): React.ReactNode {
    const { style, ...rest } = this.props

    return (
      <Image style={style} source={this.state.source} {...rest}/>
    )
  }

  @autobind
  private imageBackground(): React.ReactNode {
    const { style, children, ...rest } = this.props

    return (
      <ImageBackground style={style} source={this.state.source} {...rest}>
        {children}
      </ImageBackground>
    )
  }

  private loadFile(path: string): void {
    this.setState({ source: { uri: path } })
  }

  public componentDidMount(): void {
    const { uri, cache = true } = this.props

    if (!cache) {
      this.loadFile(uri)
    } else {
      const name = shorthash.unique(uri)
      const extension = Platform.Android ? "file://" : ""
      const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`
      RNFS.exists(path).then((exists: any) => {
        if (exists) {
          this.loadFile(path)
        } else {
          this.downloadFile(uri, path)
        }
      }).catch(noop)
    }
  }

  public render(): React.ReactNode {
    const { type } = this.props

    return this.renders[type]()
  }

}
