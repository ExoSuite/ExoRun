import * as React from "react"
import { observer } from "mobx-react"
import { Animated, ImageStyle, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Button, Screen, Text } from "@components"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { defaultNavigationIcon, NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { IPersonalTokens, IUser } from "@services/api"
import { Avatar, DefaultRnpAvatarSize } from "@components/avatar"
import { palette } from "@theme/palette"
import { headerShadow } from "@utils/shadows"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { inject } from "mobx-react/native"
import { Injection, InjectionProps } from "@services/injections"
import { action, observable } from "mobx"
import idx from "idx"
import { CachedImage, CachedImageType } from "@components/cached-image/cached-image"
import { renderIf } from "@utils/render-if"
import autobind from "autobind-decorator"
import { AppScreens } from "@navigation/navigation-definitions"
import { ApiResponse } from "apisauce"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { IFollowScreenNavigationScreenProps } from "@screens/follow-screen"

// tslint:disable:id-length

export interface IPersonalProfileNavigationScreenProps {
  me: boolean,
  user?: IUser
}

type IPersonalProfileScreenProps = NavigationScreenProps<IPersonalProfileNavigationScreenProps> & InjectionProps

const ROOT: ViewStyle = {
  width: "100%"
}

const PROFILE_COVER: ImageStyle = {
  width: "100%",
  height: 150,
  zIndex: 2,
  position: "absolute"
}

const HEADER: ViewStyle = {
  width: "100%",
  position: "absolute",
  backgroundColor: "#121212",
  height: 56,
  zIndex: 13,
  alignItems: "center",
  justifyContent: "center"
}

const HEADER_CONTENT: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  justifyContent: "space-between"
}

const ANIMATED_AVATAR: ViewStyle = {
  zIndex: 4,
  position: "absolute",
  top: 120
}

const FIXED_HEADER: ViewStyle = {
  paddingTop: 5,
  paddingBottom: 5,
  paddingLeft: 10,
  paddingRight: 10,
  flexDirection: "column",
  backgroundColor: palette.backgroundDarker,
  ...headerShadow
}

const FIXED_HEADER_TEXT_CONTAINER: ViewStyle = {
  marginLeft: 14
}

const FIXED_HEADER_DESCRIPTION: ViewStyle = {
  marginTop: spacing[3]
}

const FIXED_HEADER_NAME: TextStyle = {
  textTransform: "capitalize"
}

const ROW: ViewStyle = {
  flexDirection: "row"
}

const BUTTON_CONTAINER: ViewStyle = {
  flexDirection: "row",
  justifyContent: "flex-end"
}

const FOLLOW_ICON: ViewStyle = {
  paddingRight: spacing[2]
}

const TEXT_NUMBER: TextStyle = {
  fontWeight: "bold",
  marginLeft: 14
}

const TEXT_NUMBER_LABEL: TextStyle = {
  color: palette.offWhite,
  marginLeft: 5
}

interface IPersonalProfileScreenState {
  scrollY: Animated.Value
}

interface IAnimationObjects {
  [prop: string]: Animated.AnimatedInterpolation
}

/**
 * UserProfileScreenImpl will handle a user profile
 */
@observer
export class UserProfileScreenImpl extends React.Component<IPersonalProfileScreenProps, IPersonalProfileScreenState> {

  public get getAvatarUrl(): string {
    return this.avatarUrl || this.props.api.defaultAvatarUrl
  }

  public get getCoverUrl(): string {
    return this.coverUrl || this.props.api.defaultCoverUrl
  }

  @observable private avatarUrl = ""
  @observable private coverUrl = ""
  @observable private isUserFollowedByVisitor = false
  @observable private userProfile: IUser = {} as IUser

  public state = {
    scrollY: new Animated.Value(0)
  }

  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator({
      iconName: defaultNavigationIcon
    })
  }

  constructor(props: IPersonalProfileScreenProps) {
    super(props)
    this.userProfile = props.navigation.getParam("me") ? props.userModel : props.navigation.getParam("user")
  }

  private animate(): IAnimationObjects {
    const coverMovement = this.state.scrollY.interpolate({
      inputRange: [0, 94, 95],
      outputRange: [0, -94, -94]
    })
    const headerOpacity = this.state.scrollY.interpolate({
      inputRange: [95, 180, 181],
      outputRange: [0, 0.75, 0.75]
    })
    const headerContentOpacity = this.state.scrollY.interpolate({
      inputRange: [0, 180, 210],
      outputRange: [0, 0, 1]
    })
    const avatarMovement = this.state.scrollY.interpolate({
      inputRange: [0, 150, 151],
      outputRange: [0, -150, -150]
    })
    const avatarOpacity = this.state.scrollY.interpolate({
      inputRange: [0, 94, 95],
      outputRange: [1, 0, 0]
    })

    return {
      avatarMovement, avatarOpacity, headerContentOpacity, headerOpacity, coverMovement
    }
  }

  @autobind
  private onEditMyProfile(): void {
    this.props.navigation.navigate(AppScreens.EDIT_MY_PROFILE, {
      avatarUrl: this.avatarUrl,
      coverUrl: this.coverUrl
    })
  }

  @autobind
  private onFollowersPress(): void {
    let navigationParams: IFollowScreenNavigationScreenProps
    // tslint:disable-next-line:prefer-conditional-expression
    if (this.props.navigation.getParam("me")) {
      navigationParams = { user: { id: this.props.userModel.id } }
    } else {
      navigationParams = { user: { id: this.userProfile.id } }
    }

    this.props.navigation.navigate(AppScreens.FOLLOW, navigationParams)
  }

  @action.bound
  private async toggleFollow(): Promise<void> {
    const { api } = this.props
    if (this.isUserFollowedByVisitor) {
      await api.delete(`user/me/follows/${this.userProfile.follow.follow_id}`)
    } else {
      const followResponse: ApiResponse<IUser["follow"]> = await api.post(`user/${this.userProfile.id}/follows`)
      this.userProfile.follow = followResponse.data
    }
    this.isUserFollowedByVisitor = !this.isUserFollowedByVisitor
  }

  @action
  public async componentDidMount(): Promise<void> {
    const { api, navigation } = this.props
    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
    const token = personalTokens && personalTokens["view-picture-exorun"].accessToken || ""
    const user = navigation.getParam("user")

    if (user) {
      const userProfileRequest: ApiResponse<IUser> = await api.get(`user/${user.id}/profile`)
      this.userProfile = { ...userProfileRequest.data, nick_name: this.userProfile.nick_name }
      this.isUserFollowedByVisitor = userProfileRequest.data.follow.status
    }

    this.avatarUrl = api.buildAvatarUrl(this.userProfile.id, token)
    this.coverUrl = api.buildCoverUrl(this.userProfile.id, token)
  }

  // user-check

  public render(): React.ReactNode {
    const { avatarMovement, avatarOpacity, headerContentOpacity, headerOpacity, coverMovement } = this.animate()

    const description = idx<IUser, string>(this.userProfile, (_: any) => _.profile.description)
    const me = this.props.navigation.getParam("me")
    const visitorButtonIcon = this.isUserFollowedByVisitor ? "user-check" : "user"
    const visitorButtonText = this.isUserFollowedByVisitor ? "profile.following" : "profile.follow"

    return (
      <Screen style={ROOT} preset="fixed">
        <CachedImage
          uri={this.getCoverUrl}
          // @ts-ignore
          style={[{ transform: [{ translateY: coverMovement }] }, PROFILE_COVER]}
          resizeMode="cover"
          type={CachedImageType.ANIMATED_IMAGE}
        />
        <Animated.View style={[{ opacity: headerOpacity }, HEADER]}>
          <Animated.View style={[{ opacity: headerContentOpacity }, HEADER_CONTENT]}>
            <Avatar size={42} urlFromParent avatarUrl={this.getAvatarUrl}/>
            <Text
              style={{ marginRight: spacing[2] }}
              preset="header"
              text={`${this.userProfile.first_name} ${this.userProfile.last_name}`}
            />
          </Animated.View>
        </Animated.View>
        <Animated.View
          style={[{ opacity: avatarOpacity, transform: [{ translateY: avatarMovement }] }, ANIMATED_AVATAR]}
        >
          <Avatar size={DefaultRnpAvatarSize} urlFromParent avatarUrl={this.avatarUrl}/>
        </Animated.View>
        <Animated.ScrollView
          style={ROOT}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={
            Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              {
                useNativeDriver: true
              }
            )}
        >
          <View style={StyleSheet.flatten([FIXED_HEADER, { marginTop: 150 }])}>
            <View style={BUTTON_CONTAINER}>
              {renderIf.if(me)(
                <Button tx="profile.edit" textPreset="primaryBold" onPress={this.onEditMyProfile}/>
              ).else(
                <Button onPress={this.toggleFollow} style={ROW}>
                  <FontawesomeIcon color={palette.white} name={visitorButtonIcon} style={FOLLOW_ICON}/>
                  <Text tx={visitorButtonText} preset="bold"/>
                </Button>
              ).evaluate()}
            </View>
          </View>

          <View style={FIXED_HEADER}>
            <View style={FIXED_HEADER_TEXT_CONTAINER}>
              <Text
                preset="header"
                text={`${this.userProfile.first_name} ${this.userProfile.last_name}`}
                style={FIXED_HEADER_NAME}
              />
              <Text preset="nicknameLight" text={this.userProfile.nick_name}/>
              <Text style={FIXED_HEADER_DESCRIPTION} text={description}/>
            </View>

            <View style={[{ marginTop: 10 }, ROW]}>
              <TouchableOpacity style={ROW} onPress={this.onFollowersPress}>
                <Text style={TEXT_NUMBER}>
                  2222
                </Text>
                <Text text="Followers" style={TEXT_NUMBER_LABEL}/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginTop: 8, height: 1000 }}/>
        </Animated.ScrollView>
      </Screen>
    )
  }
}

export const UserProfileScreen = inject(Injection.Api, Injection.UserModel)(UserProfileScreenImpl)
