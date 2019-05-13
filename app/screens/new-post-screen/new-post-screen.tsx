import * as React from "react"
import { observer } from "mobx-react"
import { View, ViewStyle } from "react-native"
import { Text } from "@components/text"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { TextField } from "@components/text-field"
import InputScrollView from "react-native-input-scroll-view"
import { action, observable } from "mobx"
import { inject } from "mobx-react/native"
import { Injection, InjectionProps } from "@services/injections"
import { Screen as DeviceScreen } from "@services/device/screen"
import { Button } from "@components/button"
import { DataLoader } from "@components/data-loader"
import autobind from "autobind-decorator"

export interface INewPostScreenProps extends NavigationScreenProps<{}> {
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

/**
 * NewPostScreen will handle the post of a new "Post" resource.
 */
@inject(Injection.Api, Injection.SoundPlayer, Injection.UserModel)
@observer
export class NewPostScreen extends React.Component<INewPostScreenProps & InjectionProps> {

  @observable private newPostContent: string = null

  public static navigationOptions = {
    headerTitle: <Text tx="common.new-post" preset="header"/>,
    headerLeft: NavigationBackButtonWithNestedStackNavigator({
      iconName: "chevron-down",
    })
  }

  @autobind
  private onButtonPress(): void {
    const { api, soundPlayer, userModel } = this.props
    DataLoader.Instance.toggleIsVisible()

    api.post(`user/${userModel.id}/dashboard/posts`,  { content: this.newPostContent })
      .then(() => {
        DataLoader.Instance.success(soundPlayer.success)
      })
      .catch((error: any) => {
        DataLoader.Instance.hasErrors(error, soundPlayer.error)
      })
  }

  @action.bound
  private onChangeText(text: string): void {
    this.newPostContent = text
  }

  public render(): React.ReactNode {
    return (
      <InputScrollView style={ROOT} useAnimatedScrollView>
        <View style={CONTAINER}>
          <TextField
            placeholderTx="common.new-post-content"
            onChangeText={this.onChangeText}
            multiline
            placeholderTextColor={color.palette.lightGrey}
            inputStyle={INPUT_STYLE}
          />
        </View>
        <View style={CONTAINER}>
          <Button
            tx="common.add-new-post"
            preset="success"
            textPreset="primaryBoldLarge"
            onPress={this.onButtonPress}
          />
        </View>
      </InputScrollView>
    )
  }
}
