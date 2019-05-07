import * as React from "react"
import { observer } from "mobx-react"
import { Animated, ImageStyle, TextInput, View, ViewStyle } from "react-native"
import { Screen } from "@components/screen"
import { NavigationScreenProps } from "react-navigation"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { IUser } from "@services/api"
import { observable, runInAction } from "mobx"
import { CachedImage, CachedImageType } from "@components/cached-image"
import { TouchableGreyscaledIcon } from "@components/touchable-greyscaled-icon"
import autobind from "autobind-decorator"
import { Avatar, DefaultRnpAvatarSize } from "@components/avatar"
import { spacing } from "@theme/spacing"
import { TextField } from "@components/text-field"
import { color } from "@theme/color"
import { IOnChangeTextCallback } from "@types"
import { Button } from "@components/button"

interface IEditMyProfileScreenNavigationScreenProps {
  avatarUrl: string
  coverUrl: string
  userProfile: IUser
}

export interface IEditMyProfileScreenProps extends NavigationScreenProps<IEditMyProfileScreenNavigationScreenProps> {
}

const PROFILE_COVER: ImageStyle = {
  width: "100%",
  height: 150,
}

const BOTTOM_BORDER: ViewStyle = {
  borderBottomColor: color.palette.lighterGrey,
  borderBottomWidth: 0.5
}

const AVATAR: ViewStyle = {
  zIndex: 4,
  position: "absolute",
  top: 120,
  marginLeft: spacing[2]
}

const INPUT_STYLE: ViewStyle = {
  backgroundColor: color.transparent
}

type userProfileField = keyof IUser

/**
 * EditMyProfileScreen will handle the modification of the user profile
 */
@observer
export class EditMyProfileScreen extends React.Component<IEditMyProfileScreenProps> {

  @observable private avatarUrl = ""
  @observable private coverUrl = ""
  @observable private userProfile: IUser = {} as IUser

  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator
  }

  constructor(props: IEditMyProfileScreenProps) {
    super(props)
    this.avatarUrl = props.navigation.getParam("avatarUrl")
    this.coverUrl = props.navigation.getParam("coverUrl")
    this.userProfile = props.navigation.getParam("userProfile")
  }

  @autobind
  // tslint:disable-next-line: prefer-function-over-method no-empty
  private onProfileCoverPressed(): void {

  }

  private updateProfile(field: userProfileField): IOnChangeTextCallback {
    return (text: string): void => {
      runInAction(() => {
        if (this.userProfile[field]) {
          this.userProfile[field] = text
        } else {
          this.userProfile.profile[field] = text
        }

        console.tron.log(this.userProfile)
      })
    }
  }

  public render(): React.ReactNode {
    return (
      <Screen preset="scroll">
        <TouchableGreyscaledIcon
          iconName="camera-alt"
          iconSize={32}
          onPress={this.onProfileCoverPressed}
          opacity={0.50}
        >
          <CachedImage
            uri={this.coverUrl}
            style={PROFILE_COVER}
            resizeMode="cover"
            type={CachedImageType.BACKGROUND_IMAGE}
          />
        </TouchableGreyscaledIcon>
        <View style={AVATAR}>
          <TouchableGreyscaledIcon
            iconName="camera-alt"
            iconSize={21}
            onPress={this.onProfileCoverPressed}
            fullScreen={false}
            size={DefaultRnpAvatarSize}
          >
            <Avatar size={DefaultRnpAvatarSize} urlFromParent avatarUrl={this.avatarUrl} withMargin={false}/>
          </TouchableGreyscaledIcon>
        </View>
        <View style={{marginTop: spacing[6], width: "100%", padding: spacing[6]}}>
          <TextField
            autoCapitalize="none"
            labelTx="profile.nickName"
            placeholderTx="profile.nickName"
            inputStyle={[INPUT_STYLE, BOTTOM_BORDER]}
            placeholderTextColor={color.palette.lightGrey}
            returnKeyType="next"
            autoFocus
            defaultValue={this.userProfile.nick_name}
            onChangeText={this.updateProfile("nick_name")}
          />
          <TextField
            autoCapitalize="none"
            labelTx="profile.firstName"
            placeholderTx="profile.firstName"
            inputStyle={[INPUT_STYLE, BOTTOM_BORDER]}
            placeholderTextColor={color.palette.lightGrey}
            returnKeyType="next"
            autoFocus
            defaultValue={this.userProfile.first_name}
            onChangeText={this.updateProfile("first_name")}
          />
          <TextField
            labelTx="profile.lastName"
            autoCapitalize="none"
            placeholderTx="profile.lastName"
            inputStyle={[INPUT_STYLE, BOTTOM_BORDER]}
            placeholderTextColor={color.palette.lightGrey}
            returnKeyType="next"
            autoFocus
            defaultValue={this.userProfile.last_name}
            onChangeText={this.updateProfile("last_name")}
          />
          <View style={{marginTop: spacing[8]}}>
            <Button tx="common.update"  preset="success"  textPreset="primaryBoldLarge" />
          </View>
        </View>
      </Screen>
    )
  }
}
