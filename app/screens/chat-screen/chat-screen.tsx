import * as React from "react"
import { inject, observer } from "mobx-react"
import { TextStyle, View, ViewStyle } from "react-native"
import { color } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { GiftedChat } from "react-native-gifted-chat"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { IPersonalToken } from "@services/api"
import { action, observable } from "mobx"
import { Injection, InjectionProps } from "@services/injections"
import { IUserModel } from "@models/user-profile"
import { renderComposer, renderInputToolbar, renderMessage, renderSend } from "@screens/chat-screen/lib"
import { IMessage, User as RNGCUser } from "react-native-gifted-chat/lib/types"
import { IGroupsModel } from "@models/groups"
import autobind from "autobind-decorator"
import { IGroup } from "@models/group"
import { convertUserToRNGCFormat } from "@utils/rngc/convertUser"
import { languageTag } from "@i18n/i18n"
import { Text } from "@components/text"

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

interface IChatState {
  messages: IMessage[]
}

const maxInputLength = 2048

const TEXT_ALIGN_CENTER: TextStyle = {
  textAlign: "center"
}

/**
 * ChatScreen will show the message
 */
@inject(Injection.UserModel, Injection.Api)
@observer
export class ChatScreen extends React.Component<IChatScreenProps, IChatState> {
  private readonly giftedChatUserModel: RNGCUser
  private readonly group: IGroup
  @observable private newMessageText: string

  public state = {
    messages: []
  }

  constructor(props: IChatScreenProps) {
    super(props)
    const userModel: IUserModel = props.userModel
    const pictureToken: IPersonalToken = props.navigation.getParam("pictureToken")
    const group: IGroup = props.navigation.getParam("group")

    this.giftedChatUserModel = convertUserToRNGCFormat(
      userModel,
      props.api.buildAvatarUrl(userModel.id, pictureToken.accessToken)
    )
    this.group = group
  }

  // tslint:disable-next-line: typedef
  public static navigationOptions = ({ navigation }) => ({
    headerTitle: <Text text={navigation.getParam("group").name} preset="lightHeader" style={TEXT_ALIGN_CENTER}/>,
    headerLeft: NavigationBackButtonWithNestedStackNavigator()
  })

  @autobind
  private onSend(messages: IMessage[] = []): void {
    messages.forEach(this.group.addMessage)
  }

  @action.bound
  private updateNewMessageText(text: string): void {
    this.newMessageText = text
  }

  public render(): React.ReactNode {
    return (
      <View style={ROOT}>
        <GiftedChat
          messages={this.group.toRNGCMessagesFormat}
          alignTop={false}
          locale={languageTag}
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
}
