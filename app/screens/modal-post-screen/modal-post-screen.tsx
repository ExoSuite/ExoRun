import * as React from "react"
import { inject, observer } from "mobx-react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Text } from "@components/text"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { TextField } from "@components/text-field"
import InputScrollView from "react-native-input-scroll-view"
import { action, observable } from "mobx"
import { Injection, InjectionProps } from "@services/injections"
import { Button } from "@components/button"
import { DataLoader } from "@components/data-loader"
import autobind from "autobind-decorator"
import { ApiOkResponse } from "apisauce"
import { TextPresets } from "@components/text/text.presets"
import { isEmpty } from "lodash-es"
import { renderIf } from "@utils/render-if"
import { IPost } from "@services/api"

interface INewPostScreenNavigationScreenProps {
  currentPost?: IPost
  headerPreset: TextPresets
  headerText: string

  newPostCallback?(newPost: object): void

  toggleRefreshing(): void

  // tslint:disable-next-line: no-flag-args
  updatePostCallback(currentPost: IPost, deletePost?: boolean): void
}

export interface INewPostScreenProps extends NavigationScreenProps<INewPostScreenNavigationScreenProps> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background
}

const INPUT_STYLE: ViewStyle = {
  backgroundColor: color.transparent,
  borderBottomColor: color.palette.lighterGrey,
  borderBottomWidth: 0.5
}

const CONTAINER: ViewStyle = {
  padding: spacing[6]
}

const TEXT_ALIGN_CENTER: TextStyle = {
  textAlign: "center"
}

/**
 * ModalPostScreen will handle the post of a new "Post" resource.
 */
@inject(Injection.Api, Injection.SoundPlayer, Injection.UserModel)
@observer
export class ModalPostScreen extends React.Component<INewPostScreenProps & InjectionProps> {

  @observable private postContent: string = null

  constructor(props: INewPostScreenProps) {
    super(props)
    const deleteOrUpdate = isEmpty(this.props.navigation.getParam("newPostCallback"))
    // @ts-ignore
    this.postContent = deleteOrUpdate ? this.props.navigation.getParam("currentPost").content : null
  }

  // tslint:disable-next-line: typedef
  public static navigationOptions = ({ navigation }) => ({
    headerTitle: <Text tx={navigation.getParam("headerTitle")} preset="lightHeader" style={TEXT_ALIGN_CENTER}/>,
    headerLeft: NavigationBackButtonWithNestedStackNavigator({
      iconName: "chevron-down"
    })
  })

  // tslint:disable-next-line: no-feature-envy
  @autobind
  private deletePost(): void {
    const { api, soundPlayer, userModel, navigation } = this.props
    DataLoader.Instance.toggleIsVisible()
    const currentPost = this.props.navigation.getParam("currentPost")
    api.delete(`user/${userModel.id}/dashboard/posts/${currentPost.id}`)
      .then(() => {
        DataLoader.Instance.success(soundPlayer.success, () => {
          navigation.getParam("updatePostCallback")(navigation.getParam("currentPost"), true)
          navigation.getParam("toggleRefreshing")()
          navigation.goBack()
        })
      })
      .catch((error: any) => {
        DataLoader.Instance.hasErrors(error, soundPlayer.error)
      })
  }

  // tslint:disable-next-line: no-feature-envy
  @autobind
  private onButtonPress(): void {
    const { api, soundPlayer, userModel, navigation } = this.props
    DataLoader.Instance.toggleIsVisible()

    if (navigation.getParam("newPostCallback")) {
      api.post(`user/${userModel.id}/dashboard/posts`, { content: this.postContent })
        .then((newPost: ApiOkResponse<any>) => {
          DataLoader.Instance.success(soundPlayer.success, () => {
            navigation.getParam("newPostCallback")(newPost.data)
            navigation.getParam("toggleRefreshing")()
            navigation.goBack()
          })
        })
        .catch((error: any) => {
          DataLoader.Instance.hasErrors(error, soundPlayer.error)
        })
    } else {
      const currentPost = this.props.navigation.getParam("currentPost")
      api.patch(`user/${userModel.id}/dashboard/posts/${currentPost.id}`, { content: this.postContent })
        .then((updatedPostResponse: ApiOkResponse<IPost>) => {
          DataLoader.Instance.success(soundPlayer.success, () => {
            navigation.getParam("updatePostCallback")(updatedPostResponse.data)
            navigation.getParam("toggleRefreshing")()
            navigation.goBack()
          })
        })
        .catch((error: any) => {
          DataLoader.Instance.hasErrors(error, soundPlayer.error)
        })
    }
  }

  @action.bound
  private onChangeText(text: string): void {
    this.postContent = text
  }

  public render(): React.ReactNode {
    const deleteOrUpdate = isEmpty(this.props.navigation.getParam("newPostCallback"))
    const mainButtonTx = deleteOrUpdate ? "common.update-post" : "common.add-new-post"

    return (
      <InputScrollView style={ROOT} useAnimatedScrollView>
        <View style={CONTAINER}>
          <TextField
            placeholderTx="common.new-post-content"
            onChangeText={this.onChangeText}
            multiline
            placeholderTextColor={color.palette.lightGrey}
            inputStyle={INPUT_STYLE}
            defaultValue={this.postContent}
          />
        </View>
        <View style={CONTAINER}>
          <Button
            tx={mainButtonTx}
            preset="success"
            textPreset="primaryBoldLarge"
            onPress={this.onButtonPress}
          />
          {renderIf(deleteOrUpdate)((
            <Button
              tx="common.delete-post"
              preset="warning"
              textPreset="primaryBoldLarge"
              onPress={this.deletePost}
              style={{ marginTop: spacing[2] }}
            />
          ))}
        </View>
      </InputScrollView>
    )
  }
}
