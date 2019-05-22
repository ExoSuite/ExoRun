import * as React from "react"
import { observer } from "mobx-react"
import { View, ViewStyle } from "react-native"
import { color } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { GiftedChat } from "react-native-gifted-chat"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { IPersonalToken } from "@services/api"
import { action, observable } from "mobx"
import { inject } from "mobx-react/native"
import { Injection, InjectionProps } from "@services/injections"
import { IUserModel } from "@models/user-profile"
import { renderComposer, renderInputToolbar, renderMessage, renderSend } from "@screens/chat-screen/lib"
import { IMessage } from "react-native-gifted-chat/lib/types"
import { IGroupsModel } from "@models/groups"

interface IChatScreenNavigationProps {
  group: IGroupsModel,
  pictureToken: IPersonalToken
}

export interface IChatScreenProps extends NavigationScreenProps<IChatScreenNavigationProps>, InjectionProps {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker,
  flex: 1
}

interface IGiftedChatUserModel {
  _id: string,
  avatar: string,
  name: string,
}

const maxInputLength = 2048

// tslint:disable-next-line: completed-docs
@inject(Injection.UserModel, Injection.Api)
@observer
export class ChatScreen extends React.Component<IChatScreenProps> {
  private readonly giftedChatUserModel: IGiftedChatUserModel
  private readonly group: IGroupsModel
  @observable private messages: IMessage[] = []

  @observable private newMessageText: string

  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator()
  }

  constructor(props: IChatScreenProps) {
    super(props)
    const userModel: IUserModel = props.userModel
    const pictureToken: IPersonalToken = props.navigation.getParam("pictureToken")
    const group: IGroupsModel = props.navigation.getParam("group")

    this.giftedChatUserModel = {
      _id: userModel.id,
      name: `${userModel.first_name} ${userModel.last_name}`,
      avatar: props.api.buildAvatarUrl(userModel.id, pictureToken.accessToken)
    }
    this.group = group
  }

  // tslint:disable-next-line:prefer-function-over-method
  public render(): React.ReactNode {
    return (
      <View style={ROOT}>
        <GiftedChat
          messages={this.messages}
          alignTop={false}
          forceGetKeyboardHeight
          text={this.newMessageText}
          onInputTextChanged={this.updateNewMessageText}
          renderUsernameOnMessage
          user={this.giftedChatUserModel}
          renderSend={renderSend}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          maxInputLength={maxInputLength}
          renderMessage={renderMessage}
          onSend={this.onSend}
        />
      </View>
    )
  }

  @action.bound
  private updateNewMessageText(text: string): void {
    this.newMessageText = text
  }

  @action.bound
  private onSend(messages: IMessage[] = []): void {
    console.tron.logImportant(messages)
    this.messages = GiftedChat.append(this.messages, messages)
  }
}
