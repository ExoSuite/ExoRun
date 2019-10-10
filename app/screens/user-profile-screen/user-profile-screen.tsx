import * as React from "react"
import { inject, observer } from "mobx-react"
import { Animated, ImageStyle, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Button, Screen, Text } from "@components"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { IPersonalTokens, IPost, IUser } from "@services/api"
import { Avatar, DefaultRnpAvatarSize } from "@components/avatar"
import { palette } from "@theme/palette"
import { headerShadow } from "@utils/shadows"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
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
import { FAB, PartialIconProps } from "react-native-paper"
import moment from "moment"
import { IBoolFunction, IVoidFunction } from "@custom-types"
import { noop } from "lodash-es"

// tslint:disable:id-length

export interface IPersonalProfileNavigationScreenProps {
  me: boolean,
  pictureToken?: string
  user?: IUser,
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
  backgroundColor: palette.backgroundDarker
}

const FLOATING_BUTTON: ViewStyle = {
  position: "absolute",
  margin: 16,
  right: 0,
  bottom: 0,
  backgroundColor: palette.lightGreen
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

const ACTION_BUTTON: ViewStyle = {
  flexDirection: "row",
  marginRight: spacing[2]
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

const POST_CONTAINER: ViewStyle = {
  backgroundColor: color.backgroundDarkerer,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  margin: spacing[2],
  padding: spacing[2]
}

const TEXT_ALIGN_RIGHT: TextStyle = {
  textAlign: "right"
}

interface IAnimationObjects {
  [prop: string]: Animated.AnimatedInterpolation
}

const floatingButton = (props: PartialIconProps): React.ReactElement =>
  <FontawesomeIcon name="feather-alt" size={props.size} color={palette.offWhite}/>

const keyExtractor = (item: any, index: number): string => item.id

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
  private currentPage: number
  @observable private isUserFollowedByVisitor = false
  private maxPage: number
  private me: boolean
  private onEndReachedCalledDuringMomentum = true
  @observable private pictureToken: string
  @observable private refreshing = false
  @observable private userPosts: IPost[] = []
  @observable private userProfile: IUser = {} as IUser

  public state = {
    scrollY: new Animated.Value(0)
  }

  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator()
  }

  constructor(props: IPersonalProfileScreenProps) {
    super(props)
    this.userProfile = props.navigation.getParam("me") ? props.userModel : props.navigation.getParam("user")
    const pictureToken = props.navigation.getParam("pictureToken")
    if (pictureToken) {
      this.avatarUrl = props.api.buildAvatarUrl(this.userProfile.id, pictureToken)
      this.coverUrl = props.api.buildCoverUrl(this.userProfile.id, pictureToken)
    }
  }

  @action.bound
  private addNewPostCallback(newPost: IPost): void {
    this.userPosts.unshift(newPost)
    this.toggleRefreshing()
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

  @action
  // tslint:disable-next-line:typedef
  private async fetchPosts(needNextPage = false): Promise<void> {
    const { api, navigation, userModel } = this.props

    const user = navigation.getParam("user")
    let uri: string
    // tslint:disable-next-line: prefer-conditional-expression
    if (user) {
      uri = `user/${user.id}/dashboard/posts`
    } else {
      uri = `user/${userModel.id}/dashboard/posts`
    }

    if (needNextPage) {
      uri += `?page=${this.currentPage}`
    }

    try {
      const userPosts = await api.get(uri)
      this.currentPage = userPosts.data.current_page
      if (!needNextPage) {
        this.maxPage = userPosts.data.last_page
        this.userPosts = userPosts.data.data
      } else {
        this.userPosts.push(...userPosts.data.data)
      }
    } catch (e) {
      return
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
  private onEndReached(): void {
    if (this.currentPage < this.maxPage && !this.onEndReachedCalledDuringMomentum) {
      this.currentPage += 1
      this.fetchPosts(true).catch(noop)
    }
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

  @autobind
  private onMomentumScrollBegin(): void {
    this.onEndReachedCalledDuringMomentum = false
  }

  @autobind
  // tslint:disable-next-line:typedef
  private onNewOrUpdatePostPress(event: any, update = false, currentPost?: IPost): void {
    if (!update) {
      this.props.navigation.navigate(AppScreens.NEW_POST, {
        newPostCallback: this.addNewPostCallback,
        toggleRefreshing: this.toggleRefreshing,
        headerTitle: "common.new-post",
        headerPreset: "header"
      })
    } else {
      this.props.navigation.navigate(AppScreens.NEW_POST, {
        currentPost: currentPost,
        updatePostCallback: this.updatePostCallback,
        toggleRefreshing: this.toggleRefreshing,
        headerTitle: "common.update-delete-post"
      })
    }
  }

  @autobind
  private onPressGoToRuns(): void {
    this.props.navigation.navigate(AppScreens.RUNS, {
      userProfile: this.userProfile
    })
  }

  @autobind
  private onUserWantToUpdatePost(currentPost: IPost): IVoidFunction {
    return (): void => {
      this.onNewOrUpdatePostPress(null, true, currentPost)
    }
  }

  @autobind
  private renderPost({ item }: { item: IPost }): React.ReactElement {
    const { api, userModel } = this.props
    const avatarUrl = api.buildAvatarUrl(item.author_id, this.pictureToken)
    const user: IUser = this.me ? userModel : this.userProfile
    const formattedCreatedAt = moment(item.created_at).format("LLL")
    const formattedUpdatedAt = moment(item.updated_at).format("LLL")

    return (
      <TouchableOpacity
        style={POST_CONTAINER}
        onLongPress={this.onUserWantToUpdatePost(item)}
        disabled={!this.me}
      >
        <View style={ROW}>
          <Avatar avatarUrl={avatarUrl} urlFromParent size={42}/>
          <View style={{ marginLeft: spacing[2], justifyContent: "center" }}>
            <Text
              style={{ textTransform: "capitalize" }}
              text={`${user.first_name} ${user.last_name}`}
              preset="userRow"
            />
            <Text preset="nicknameLight" text={user.nick_name}/>
          </View>
        </View>
        <View style={{ marginTop: spacing[3] }}>
          <Text text={item.content}/>
        </View>
        <View style={{ ...ROW, flex: 1, marginTop: spacing[3] }}>
          <View>
            <Text preset="fieldLabel" tx="common.createdAt"/>
            <Text preset="fieldLabel" text={formattedCreatedAt}/>
          </View>
          <View style={{ alignSelf: "flex-end", flex: 1 }}>
            <Text preset="fieldLabel" tx="common.updatedAt" style={TEXT_ALIGN_RIGHT}/>
            <Text preset="fieldLabel" text={formattedUpdatedAt} style={TEXT_ALIGN_RIGHT}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  @action.bound
  private async toggleFollow(): Promise<void> {
    const { api } = this.props
    if (this.isUserFollowedByVisitor) {
      await api.delete(`user/me/follows/${this.userProfile.follow.follow_id}`)
      this.userPosts = []
    } else {
      const followResponse: ApiResponse<IUser["follow"]> = await api.post(`user/${this.userProfile.id}/follows`)
      this.userProfile.follow = followResponse.data
      this.fetchPosts().catch(noop)
    }
    this.isUserFollowedByVisitor = !this.isUserFollowedByVisitor
  }

  @action.bound
  private toggleRefreshing(): void {
    this.refreshing = !this.refreshing
  }

  @action.bound
  // tslint:disable-next-line:typedef
  private updatePostCallback(currentPost: IPost, deletePost = false): void {
    if (!deletePost) {
      const currentPostIndex = this.userPosts.findIndex((post: any) => post.id === currentPost.id)
      this.userPosts[currentPostIndex] = currentPost
      this.userPosts = this.userPosts.slice()
    } else {
      this.userPosts = this.userPosts.filter((post: any) => post.id !== currentPost.id)
    }
    this.toggleRefreshing()
  }

  @action
  public async componentDidMount(): Promise<void> {
    const { api, navigation } = this.props
    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
    const token = personalTokens && personalTokens["view-picture-exorun"].accessToken || ""
    this.pictureToken = token
    const user = navigation.getParam("user")
    this.me = navigation.getParam("me")

    if (user) {
      const userProfileRequest: ApiResponse<IUser> = await api.get(`user/${user.id}/profile`)
      this.userProfile = { ...userProfileRequest.data, nick_name: this.userProfile.nick_name }
      this.isUserFollowedByVisitor = userProfileRequest.data.follow.status
    }

    await this.fetchPosts().catch(noop)
    this.avatarUrl = api.buildAvatarUrl(this.userProfile.id, token)
    this.coverUrl = api.buildCoverUrl(this.userProfile.id, token)
  }

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
        <Animated.FlatList
          style={ROOT}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          refreshing={this.refreshing}
          onScroll={
            Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              {
                useNativeDriver: true
              }
            )}
          data={this.userPosts}
          renderItem={this.renderPost}
          keyExtractor={keyExtractor}
          ListHeaderComponent={(
            <View style={{ marginBottom: spacing[2], ...headerShadow }}>
              <View style={StyleSheet.flatten([FIXED_HEADER, { marginTop: 150 }])}>
                <View style={BUTTON_CONTAINER}>
                  {renderIf.if(me)(
                    <Button tx="profile.edit" textPreset="primaryBold" onPress={this.onEditMyProfile}/>
                  ).else(
                    <Button onPress={this.toggleFollow} style={ACTION_BUTTON}>
                      <FontawesomeIcon color={palette.white} name={visitorButtonIcon} style={FOLLOW_ICON}/>
                      <Text tx={visitorButtonText} preset="bold"/>
                    </Button>
                  ).evaluate()}
                  {
                    renderIf.if(!me)(
                    <Button onPress={this.onPressGoToRuns} style={ACTION_BUTTON}>
                      <FontawesomeIcon color={palette.white} name={visitorButtonIcon} style={FOLLOW_ICON}/>
                      <Text tx={"profile.run"} preset="bold"/>
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

                {/*<View style={[{ marginTop: 10 }, ROW]}>
                  <TouchableOpacity style={ROW} onPress={this.onFollowersPress} disabled>
                    <Text style={TEXT_NUMBER}>
                      2222
                    </Text>
                    <Text text="Followers" style={TEXT_NUMBER_LABEL}/>
                  </TouchableOpacity>
                </View>*/}
              </View>
            </View>
          )}
          ListFooterComponent={<View style={{ marginBottom: spacing[8] }}/>}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
        />
        {renderIf(me)((
          <FAB
            style={FLOATING_BUTTON}
            small
            icon={floatingButton}
            onPress={this.onNewOrUpdatePostPress}
          />
        ))}
      </Screen>
    )
  }
}

export const UserProfileScreen = inject(Injection.Api, Injection.UserModel)(UserProfileScreenImpl)
