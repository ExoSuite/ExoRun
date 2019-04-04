import * as React from "react"
import { ImageSourcePropType, TouchableOpacity, ViewStyle } from "react-native"
import { observer } from "mobx-react/native"
import { NavigationScreenProps } from "react-navigation"
import { action, observable } from "mobx"
import autobind from "autobind-decorator"
import { Avatar as RnpAvatar } from "react-native-paper"
import { IVoidFunction } from "@types"
import { spacing } from "@theme"

export interface IAvatarProps {
  disableOnPress?: boolean,
  onPress?: IVoidFunction,
  rootStyle?: ViewStyle,
  size?: number
}

const ROOT: ViewStyle = {
  marginLeft: spacing[2]
}

export const defaultSize = 34
export const DefaultRnpAvatarSize = 64

/**
 * The avatar will be visible on the left of the header component.
 */
@observer
export class Avatar extends React.Component<IAvatarProps & Partial<NavigationScreenProps<any>>> {

  @observable private avatarUrl: string

  @autobind
  private openDrawer(): void {
    console.tron.log(this.props.navigation.dangerouslyGetParent().openDrawer)
    this.props.navigation.dangerouslyGetParent().openDrawer()
  }

  @action
  public async componentWillMount(): Promise<void> {
    this.avatarUrl = "https://api.adorable.io/avatars/285"
  }

  public render(): React.ReactNode {
    const { rootStyle, disableOnPress, onPress, size, navigation } = this.props
    const containerStyle = { ...ROOT, ...rootStyle }
    const touchable = disableOnPress
    const onTouchableOpacityPressed = navigation ? this.openDrawer : onPress
    const avatarSize = size ? size : defaultSize
    const avatarSource: ImageSourcePropType = {
      uri: this.avatarUrl
    }

    return (
      <TouchableOpacity
        onPress={onTouchableOpacityPressed}
        style={containerStyle}
        disabled={touchable}
      >
        <RnpAvatar.Image
          size={avatarSize}
          source={avatarSource}
        />
      </TouchableOpacity>
    )
  }
}
