import * as React from "react";
import { ImageStyle, StyleSheet, View } from "react-native"
import { CachedImage } from "@components/cached-image/cached-image"
import { inject } from "mobx-react/native"
import { Injection } from "@services/injections"
import { Api } from "@services/api"
import { Theme, withTheme } from "react-native-paper"

export interface IAvatarImageReactNativePaperProps {
  api?: Api
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
@inject(Injection.Api)
class AvatarImageReactNativePaperImpl extends React.Component<IAvatarImageReactNativePaperProps> {

  private readonly defaultAvatarUrl: string

  public static defaultProps = {
    size: 64
  }
  public static displayName = "Avatar.Image"

  constructor(props: IAvatarImageReactNativePaperProps) {
    super(props)
    this.defaultAvatarUrl = props.api.defaultAvatarUrl
  }

  public render(): React.ReactNode {
    const { size, uri, style, theme } = this.props;
    const { colors } = theme;
    console.tron.log(uri)

    const { backgroundColor = colors.primary } = StyleSheet.flatten(style) || {};

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
          defaultUrl={this.defaultAvatarUrl}
        />
      </View>
    )
  }
}

const AvatarImageReactNativePaper = withTheme(AvatarImageReactNativePaperImpl)

export {
  AvatarImageReactNativePaper
}
