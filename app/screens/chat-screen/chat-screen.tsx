import * as React from "react"
import { observer } from "mobx-react"
import { TouchableWithoutFeedback, View, ViewStyle } from "react-native"
import { color } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { GiftedChat } from "react-native-gifted-chat"
import { defaultNavigationIcon, NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { IGroup, IPersonalToken } from "@services/api"
import KeyboardSpacer from "react-native-keyboard-spacer";
import autobind from "autobind-decorator"
import { action, observable } from "mobx"
import { inject } from "mobx-react/native"
import { Injection, InjectionProps } from "@services/injections"
import { IUserModel } from "@models/user-profile"

interface IChatScreenNavigationProps {
  group: IGroup,
  pictureToken: IPersonalToken
}

export interface IChatScreenProps extends NavigationScreenProps<IChatScreenNavigationProps>, InjectionProps {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1
}

interface IGiftedChatUserModel {
  _id: string,
  avatar: string,
  name: string,
}

// @inject("mobxstuff")
// tslint:disable-next-line: completed-docs
@inject(Injection.UserModel, Injection.Api)
@observer
export class ChatScreen extends React.Component<IChatScreenProps> {
  private readonly giftedChatUserModel: IGiftedChatUserModel

  @observable private newMessageText: string

  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator()
  }

  constructor(props: IChatScreenProps) {
    super(props)
    const userModel: IUserModel = props.userModel
    const pictureToken: IPersonalToken = props.navigation.getParam("pictureToken")

    this.giftedChatUserModel = {
      _id: userModel.id,
      name: `${userModel.first_name} ${userModel.last_name}`,
      avatar: props.api.buildAvatarUrl(userModel.id, pictureToken.accessToken)
    }
  }

  @action.bound
  private updateNewMessageText(text: string): void {
    this.newMessageText = text
  }

  // tslint:disable-next-line:prefer-function-over-method
  public render(): React.ReactNode {
    return (
      <TouchableWithoutFeedback style={ROOT}>
        <GiftedChat
          alignTop={false}
          forceGetKeyboardHeight
          text={this.newMessageText}
          onInputTextChanged={this.updateNewMessageText}
          renderUsernameOnMessage
          user={this.giftedChatUserModel}
        />
      </TouchableWithoutFeedback>
    )
  }
}
