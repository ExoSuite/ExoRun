import PropTypes from "prop-types"
import React from "react"
import { StyleSheet, View, ViewPropTypes, ViewStyle } from "react-native"

import { Avatar, Day, utils } from "react-native-gifted-chat"
import { Bubble } from "./Bubble"
import { IMessage, User } from "react-native-gifted-chat/lib/types"

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

export class Message extends React.Component<IMessageProps> {

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
            styles.container,
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
    const avatarProps = this.getInnerComponentProps();

    return (
      <Avatar
        {...avatarProps}
        // @ts-ignore
        imageStyle={{ left: [styles.avatar, avatarProps.imageStyle] }}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    marginLeft: 8,
    marginRight: 0
  },
  avatar: {
    // The bottom should roughly line up with the first line of message text.
    height: 40,
    width: 40,
    borderRadius: 3
  }
})

// @ts-ignore
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

// @ts-ignore
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
