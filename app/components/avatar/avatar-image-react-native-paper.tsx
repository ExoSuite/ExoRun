import * as React from "react"
import { ImageStyle, StyleSheet, View } from "react-native"
import { CachedImage, CachedImageType } from "@components/cached-image/cached-image"
import { Theme, withTheme } from "react-native-paper"

export interface IAvatarImageReactNativePaperProps {
  /**
   * Size of the avatar.
   */
  size: number
  style?: ImageStyle,
  /**
   * @optional
   */
  theme: Theme,
  /**
   * Image to display for the `Avatar`.
   */
  uri: string,

  cache?: boolean
}

/**
 * Avatars can be used to represent people in a graphical way.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { AvatarImageReactNativePaper } from "@components/avatar/avatar-image-react-native-paper"
 *
 * const MyComponent = () => (
 *   <AvatarImageReactNativePaper size={24} source={require('../assets/avatar.png')} />
 * );
 * ```
 */
class AvatarImageReactNativePaperImpl extends React.PureComponent<IAvatarImageReactNativePaperProps> {

  public static defaultProps = {
    size: 64
  }
  public static displayName = "Avatar.Image"

  public render(): React.ReactNode {
    const { size, uri, style, cache } = this.props

    const { backgroundColor = "transparent" } = StyleSheet.flatten(style) || {}

    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor
          },
          style
        ]}
      >
        <CachedImage
          uri={uri}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          type={CachedImageType.IMAGE}
          cache={cache}
        />
      </View>
    )
  }
}

const AvatarImageReactNativePaper = withTheme(AvatarImageReactNativePaperImpl)

export {
  AvatarImageReactNativePaper
}
