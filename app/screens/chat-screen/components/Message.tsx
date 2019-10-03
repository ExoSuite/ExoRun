import PropTypes from "prop-types"
import React from "react"
import { ImageStyle, View, ViewPropTypes, ViewStyle } from "react-native"

import { Avatar, Day, utils } from "react-native-gifted-chat"
import { Bubble } from "./Bubble"
import { IMessage, User } from "react-native-gifted-chat/lib/types"
import { inject } from "mobx-react"
import { Injection, InjectionProps } from "@services/injections"

const { isSameUser, isSameDay } = utils

interface IMessageProps {
  containerStyle: ViewStyle
  currentMessage: IMessage
  nextMessage: IMessage
  previousMessage: IMessage
  user: User

  renderAvatar(props: any): React.ReactElement

  renderBubble(props: any): React.ReactElement

  renderDay(props: any): React.ReactElement
}

const CONTAINER: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-end",
  justifyContent: "flex-start",
  marginLeft: 8,
  marginRight: 0
}

const AVATAR: ImageStyle = {
  height: 40,
  width: 40,
  borderRadius: 3
}

/**
 * Message will handle the content of a message
 *
 */
@inject(Injection.SoundPlayer)
export class Message extends React.Component<IMessageProps & InjectionProps> {

  public static defaultProps
  public static propTypes

  public getInnerComponentProps(): object {
    // @ts-ignore
    const { containerStyle, ...props } = this.props

    return {
      ...props,
      position: "left",
      isSameUser,
      isSameDay
    }
  }

  public render(): React.ReactNode {
    const marginBottom = isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10

    return (
      <View>
        {this.renderDay()}
        <View
          style={[
            CONTAINER,
            { marginBottom },
            // @ts-ignore
            this.props.containerStyle
          ]}
        >
          {this.renderAvatar()}
          {this.renderBubble()}
        </View>
      </View>
    )
  }

  public renderAvatar(): React.ReactNode {
    const avatarProps = this.getInnerComponentProps()

    return (
      <Avatar
        {...avatarProps}
        // @ts-ignore
        imageStyle={{ left: [AVATAR, avatarProps.imageStyle] }}
      />
    )
  }

  public renderBubble(): React.ReactNode {
    const bubbleProps = this.getInnerComponentProps()
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps)
    }

    // @ts-ignore
    return <Bubble {...bubbleProps} />
  }

  public renderDay(): React.ReactNode {
    if (this.props.currentMessage.createdAt) {
      const dayProps = this.getInnerComponentProps()
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps)
      }

      return <Day {...dayProps} />
    }

    return null
  }

}

Message.defaultProps = {
  renderAvatar: undefined,
  renderBubble: null,
  renderDay: null,
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
  containerStyle: {}
}

Message.propTypes = {
  renderAvatar: PropTypes.func,
  renderBubble: PropTypes.func,
  renderDay: PropTypes.func,
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  user: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  })
}
