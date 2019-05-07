import * as React from "react"
import { observer } from "mobx-react"
import { Animated, ImageStyle, StyleSheet, View, ViewStyle } from "react-native"
import { Button, Screen, Text } from "@components"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { ApiRoutes, IPersonalTokens, IUser } from "@services/api"
import { Avatar, DefaultRnpAvatarSize } from "@components/avatar"
import { palette } from "@theme/palette"
import { headerShadow } from "@utils/shadows"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { load as loadFromStorage, StorageTypes } from "@utils/storage"
import { inject } from "mobx-react/native"
import { Injection, InjectionProps } from "@services/injections"
import { action, observable, runInAction } from "mobx"
import idx from "idx"
import { CachedImage, CachedImageType } from "@components/cached-image/cached-image"
import { renderIf } from "@utils/render-if"
import autobind from "autobind-decorator"
import { AppScreens } from "@navigation/navigation-definitions"

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

interface IPersonalProfileScreenState {
  scrollY: Animated.Value
}

interface IAnimationObjects {
  [prop: string]: Animated.AnimatedInterpolation
}

const whenVisitingMyProfile = async (): Promise<IUser> => loadFromStorage(StorageTypes.USER_PROFILE)

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
  @observable private userProfile: IUser = {} as IUser

  public state = {
    scrollY: new Animated.Value(0)
  }

  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator
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
    this.props.navigation.navigate(AppScreens.EDIT_MY_PROFILE , {
      userProfile: this.userProfile,
      avatarUrl: this.avatarUrl,
      coverUrl: this.coverUrl
    })
  }

  @action
  public async componentDidMount(): Promise<void> {
    const { api } = this.props
    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
    const token = personalTokens && personalTokens["view-picture-exorun"].accessToken || ""

    if (this.props.navigation.getParam("me")) {
      this.userProfile = await whenVisitingMyProfile()
    } else {
      // tslint:disable-next-line:no-commented-code no-commented-out-code
      // this.userProfile = await this.whenVisitingMyProfile();
    }

    this.avatarUrl =
      `${api.Url}/user/${this.userProfile.id}/${ApiRoutes.PROFILE_PICTURE_AVATAR}?token=${token}`
    this.coverUrl =
      `${api.Url}/user/${this.userProfile.id}/${ApiRoutes.PROFILE_PICTURE_COVER}?token=${token}`
  }

  public render(): React.ReactNode {
    const { avatarMovement, avatarOpacity, headerContentOpacity, headerOpacity, coverMovement } = this.animate()

    const description = idx<IUser, string>(this.userProfile, (_: any) => _.profile.description)
    const me = this.props.navigation.getParam("me")

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
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              {renderIf(me)((
                <Button tx="profile.edit" textPreset="primaryBold" onPress={this.onEditMyProfile}/>
              ))}
            </View>
          </View>

          <View style={FIXED_HEADER}>
            <View style={{ marginLeft: 14 }}>
              <Text preset="header" text={`${this.userProfile.first_name} ${this.userProfile.last_name}`}/>
              <Text preset="nicknameLight" text={this.userProfile.nick_name}/>
              <Text style={{ marginTop: spacing[3] }} text={description}/>
            </View>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", marginLeft: 14 }}
                >
                  2222
                </Text>
                <Text style={{ fontSize: 16, color: "#555", marginLeft: 5 }}>
                  Following
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", marginLeft: 30 }}
                >
                  2222
                </Text>
                <Text style={{ fontSize: 16, color: "#555", marginLeft: 5 }}>
                  Followers
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 8, height: 1000 }}/>
        </Animated.ScrollView>
      </Screen>
    )
  }
}

export const UserProfileScreen = inject(Injection.Api)(UserProfileScreenImpl)
