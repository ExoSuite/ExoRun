// tslint:disable:id-length
import * as React from "react"
import { inject, observer } from "mobx-react"
import { ImageStyle, View, ViewStyle } from "react-native"
import InputScrollView from "react-native-input-scroll-view"
import { NavigationScreenProps } from "react-navigation"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { IUser } from "@services/api"
import { action, observable, runInAction } from "mobx"
import autobind from "autobind-decorator"
import { spacing } from "@theme/spacing"
import { TextField } from "@components/text-field"
import { color } from "@theme/color"
import { IOnChangeTextCallback } from "@types"
import { Button } from "@components/button"
import idx from "idx"
import DateTimePicker from "react-native-modal-datetime-picker"
import { Injection, InjectionProps } from "@services/injections"
import moment from "moment"
import lodash, { clone } from "lodash-es"
import R from "ramda"
import { DataLoader } from "@components/data-loader"
import { updateUserModel } from "@models/user-profile"

interface IEditMyProfileScreenNavigationScreenProps {
  avatarUrl: string
  coverUrl: string
  userProfile: IUser
}

export interface IEditMyProfileScreenProps
  extends NavigationScreenProps<IEditMyProfileScreenNavigationScreenProps>, InjectionProps {
}

const CONTAINER: ViewStyle = {
  backgroundColor: color.background
}

const PROFILE_COVER: ImageStyle = {
  width: "100%",
  height: 150
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

/**
 * EditMyProfileScreen will handle the modification of the user profile
 */
@inject(Injection.Api, Injection.SoundPlayer, Injection.UserModel)
@observer
export class EditMyProfileScreen extends React.Component<IEditMyProfileScreenProps> {
  @observable private readonly avatarUrl
  @observable private readonly coverUrl
  @observable private isDateTimePickerVisible = false
  @observable private readonly userProfile: IUser = {} as IUser

  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator()
  }

  constructor(props: IEditMyProfileScreenProps) {
    super(props)
    this.avatarUrl = props.navigation.getParam("avatarUrl")
    this.coverUrl = props.navigation.getParam("coverUrl")
    this.userProfile = clone(props.userModel)
    this.userProfile.profile = clone(props.userModel.profile)
  }

  @action.bound
  private handleDatePicked(date: Date): void {
    this.userProfile.profile.birthday = moment(date).format("YYYY-MM-DD")
    this.toggleIsDateTimePickerVisible()
  }

  @autobind
  // tslint:disable-next-line: prefer-function-over-method no-empty
  private onProfileCoverPressed(): void {

  }

  @autobind
  private async sendUpdateToServer(): Promise<void> {
    const { api, soundPlayer, userModel } = this.props
    DataLoader.Instance.toggleIsVisible()

    // pick only wanted data from profile and user
    const userData = R.pick(["first_name", "last_name", "nick_name"], this.userProfile)
    const userProfileData = R.pick(["description", "city", "birthday"], this.userProfile.profile)

    // remove potential falsey values
    const userUpdatePromise = api.patch("user/me", lodash.pickBy(userData, lodash.identity))
    const userProfileUpdatePromise = api.patch("user/me/profile", lodash.pickBy(userProfileData, lodash.identity))

    await Promise.all([userUpdatePromise, userProfileUpdatePromise])
      .then(async () => {
        updateUserModel(this.userProfile, userModel)
        DataLoader.Instance.success(soundPlayer.playSuccess)
      })
      .catch((err: any) => {
        DataLoader.Instance.hasErrors(err, soundPlayer.playError)
      })
  }

  @action.bound
  private toggleIsDateTimePickerVisible(): void {
    this.isDateTimePickerVisible = !this.isDateTimePickerVisible
  }

  private updateProfile(field: string): IOnChangeTextCallback {
    return (text: string): void => {
      runInAction(() => {
        if (this.userProfile[field] !== undefined) {
          this.userProfile[field] = text
        } else {
          this.userProfile.profile[field] = text
        }
      })
    }
  }

  public render(): React.ReactNode {
    const description = idx<IUser, string>(this.userProfile, (accessor: any) => accessor.profile.description)
    const city = idx<IUser, string>(this.userProfile, (accessor: any) => accessor.profile.city)
    let birthday = idx<IUser, string>(this.userProfile, (accessor: any) => accessor.profile.birthday)
    if (birthday) {
      birthday = moment(birthday).format("LL")
    }

    return (
      <InputScrollView style={CONTAINER} useAnimatedScrollView>
        {/*   <TouchableGreyscaledIcon
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
        </View>*/}
        <View style={{ marginTop: spacing[6], width: "100%", padding: spacing[6] }}>
          <TextField
            autoCapitalize="none"
            labelTx="profile.nickName"
            placeholderTx="profile.nickName"
            inputStyle={[INPUT_STYLE, BOTTOM_BORDER]}
            placeholderTextColor={color.palette.lightGrey}
            returnKeyType="next"
            defaultValue={this.userProfile.nick_name}
            onChangeText={this.updateProfile("nick_name")}
          />
          <TextField
            autoCapitalize="words"
            labelTx="profile.firstName"
            placeholderTx="profile.firstName"
            inputStyle={[INPUT_STYLE, BOTTOM_BORDER]}
            placeholderTextColor={color.palette.lightGrey}
            returnKeyType="next"
            defaultValue={this.userProfile.first_name}
            onChangeText={this.updateProfile("first_name")}
          />
          <TextField
            labelTx="profile.lastName"
            autoCapitalize="words"
            placeholderTx="profile.lastName"
            inputStyle={[INPUT_STYLE, BOTTOM_BORDER]}
            placeholderTextColor={color.palette.lightGrey}
            returnKeyType="next"
            defaultValue={this.userProfile.last_name}
            onChangeText={this.updateProfile("last_name")}
          />
          <TextField
            labelTx="profile.description"
            autoCapitalize="none"
            placeholderTx="profile.description"
            inputStyle={[INPUT_STYLE, BOTTOM_BORDER]}
            placeholderTextColor={color.palette.lightGrey}
            returnKeyType="next"
            defaultValue={description}
            multiline
            onChangeText={this.updateProfile("description")}
          />
          <TextField
            labelTx="profile.city"
            autoCapitalize="none"
            placeholderTx="profile.city"
            inputStyle={[INPUT_STYLE, BOTTOM_BORDER]}
            placeholderTextColor={color.palette.lightGrey}
            returnKeyType="next"
            defaultValue={city}
            onChangeText={this.updateProfile("city")}
          />
          <TextField
            onTouchStart={this.toggleIsDateTimePickerVisible}
            labelTx="profile.birthday"
            autoCapitalize="none"
            placeholderTx="profile.birthday"
            inputStyle={[INPUT_STYLE, BOTTOM_BORDER]}
            placeholderTextColor={color.palette.lightGrey}
            returnKeyType="next"
            defaultValue={birthday}
            editable={false}
          />

          <View style={{ marginTop: spacing[6] }}>
            <Button
              tx="common.update"
              preset="success"
              textPreset="primaryBoldLarge"
              onPress={this.sendUpdateToServer}
            />
          </View>
        </View>
        <DateTimePicker
          isVisible={this.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.toggleIsDateTimePickerVisible}
        />
      </InputScrollView>
    )
  }
}
