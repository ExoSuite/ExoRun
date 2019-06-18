import React from "react"
import PropTypes from "prop-types"
import { Clipboard, Platform, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"

import { MessageImage, MessageText, Time, utils } from "react-native-gifted-chat"
import { Text } from "@components/text"
import { IMessage } from "react-native-gifted-chat/lib/types"
import { presets } from "@components/text/text.presets"

const { isSameUser, isSameDay } = utils

interface IBubbleProps {
  containerStyle: ViewStyle
  containerToNextStyle: ViewStyle
  containerToPreviousStyle: ViewStyle
  currentMessage: IMessage
  messageTextStyle: TextStyle
  nextMessage: any
  previousMessage: IMessage
  tickStyle: ViewStyle
  touchableProps: any
  user: any
  usernameStyle: TextStyle
  wrapperStyle: ViewStyle

  onLongPress(context: any, currentMessage: IMessage): void

  renderCustomView(props: any): React.ReactElement

  renderMessageImage(props: any): React.ReactElement

  renderMessageText(props: any): React.ReactElement

  renderTicks(props: any): React.ReactElement

  renderTime(props: any): React.ReactElement

  renderUsername(props: any): React.ReactElement
}

// tslint:disable

export class Bubble extends React.Component<IBubbleProps> {
  static contextTypes: { actionSheet: PropTypes.Requireable<(...args: any[]) => any>; }

  constructor(props) {
    super(props)
    this.onLongPress = this.onLongPress.bind(this)
  }

  public onLongPress() {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.context, this.props.currentMessage)
    } else {
      if (this.props.currentMessage.text) {
        const options = [
          "Copy Text",
          "Cancel"
        ]
        const cancelButtonIndex = options.length - 1
        this.context.actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex
          },
          (buttonIndex) => {
            if (buttonIndex === 0) {
              Clipboard.setString(this.props.currentMessage.text)
            }
          })
      }
    }
  }

  public render() {
    const isSameThread = isSameUser(this.props.currentMessage, this.props.previousMessage)
      && isSameDay(this.props.currentMessage, this.props.previousMessage)

    const messageHeader = isSameThread ? null : (
      <View style={styles.headerView}>
        {this.renderUsername()}
        {this.renderTime()}
        {this.renderTicks()}
      </View>
    )

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          onLongPress={this.onLongPress}
          accessibilityTraits="text"
          {...this.props.touchableProps}
        >
          <View
            style={[
              styles.wrapper,
              this.props.wrapperStyle
            ]}
          >
            <View>
              {this.renderCustomView()}
              {messageHeader}
              {this.renderMessageImage()}
              {this.renderMessageText()}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  public renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props)
    }

    return null
  }

  public renderMessageImage() {
    if (this.props.currentMessage.image) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = this.props
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps)
      }

      return (
        <MessageImage
          {...messageImageProps}
          // @ts-ignore
          imageStyle={[styles.image, messageImageProps.imageStyle]}/>
      )
    }

    return null
  }

  public renderMessageText() {
    if (this.props.currentMessage.text) {
      const { containerStyle, wrapperStyle, messageTextStyle, ...messageTextProps } = this.props
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps)
      }

      return (
        <MessageText
          {...messageTextProps}
          // @ts-ignore
          textStyle={{
            left: {
              ...styles.standardFont,
              ...styles.messageText,
              // @ts-ignore
              ...messageTextProps.textStyle,
              ...messageTextStyle
            }
          }}
        />
      )
    }

    return null
  }

  public renderTicks() {
    const { currentMessage } = this.props
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage)
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return null
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles.headerItem, styles.tickView]}>
          {currentMessage.sent && <Text style={[styles.standardFont, styles.tick, this.props.tickStyle]}>✓</Text>}
          {currentMessage.received && <Text style={[styles.standardFont, styles.tick, this.props.tickStyle]}>✓</Text>}
        </View>
      )
    }

    return null
  }

  public renderTime() {
    if (this.props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, ...timeProps } = this.props
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps)
      }

      return (
        <Time
          {...timeProps}
          // @ts-ignore
          containerStyle={{ left: [styles.timeContainer] }}
          // @ts-ignore
          textStyle={{ left: [styles.standardFont, styles.headerItem, styles.time, timeProps.textStyle] }}
        />
      )
    }

    return null
  }

  public renderUsername() {
    const username = this.props.currentMessage.user.name
    if (username) {
      const { containerStyle, wrapperStyle, ...usernameProps } = this.props
      if (this.props.renderUsername) {
        return this.props.renderUsername(usernameProps)
      }

      return (
        <Text style={[styles.standardFont, styles.headerItem, styles.username, this.props.usernameStyle]}>
          {username}
        </Text>
      )
    }

    return null
  }

}

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = StyleSheet.create({
  standardFont: presets.default,
  messageText: {
    marginLeft: 0,
    marginRight: 0
  },
  container: {
    flex: 1,
    alignItems: "flex-start"
  },
  wrapper: {
    marginRight: 60,
    minHeight: 20,
    justifyContent: "flex-end"
  },
  username: {
    fontWeight: "bold"
  },
  time: {
    textAlign: "left",
    fontSize: 12
  },
  timeContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  },
  headerItem: {
    marginRight: 10
  },
  headerView: {
    marginTop: Platform.OS === "android" ? -2 : 0,
    flexDirection: "row",
    alignItems: "baseline"
  },
  tick: {
    backgroundColor: "transparent",
    color: "white"
  },
  tickView: {
    flexDirection: "row"
  },
  image: {
    borderRadius: 3,
    marginLeft: 0,
    marginRight: 0
  }
})

Bubble.contextTypes = {
  // @ts-ignore
  actionSheet: (): any => null,
};

// @ts-ignore
Bubble.defaultProps = {
  touchableProps: {},
  onLongPress: null,
  renderMessageImage: null,
  renderMessageText: null,
  renderCustomView: null,
  renderTime: null,
  currentMessage: {
    text: null,
    createdAt: null,
    image: null
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  tickStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {}
}
