import * as React from "react"
import { Composer, InputToolbar, Send } from "react-native-gifted-chat"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { color } from "@theme/color"
import { TextStyle, View, ViewStyle } from "react-native"
import { spacing } from "@theme/spacing"
import { footerShadow } from "@utils/shadows"
import { presets } from "@components/text/text.presets"
import { Platform } from "@services/device"
import emojiUtils from "emoji-utils"
import { Message } from "@screens/chat-screen/components/Message"

const CHAT_TEXT_INPUT_CONTAINER: ViewStyle = {
  ...footerShadow,
  backgroundColor: color.backgroundDarkerer,
  borderTopWidth: 0
}

const COMPOSER: TextStyle = {
  ...presets.bold,
  color: color.palette.white
}

export function renderSend(props: object): React.ReactElement {
  return (
    <Send {...props}>
      <View style={{ marginRight: spacing[3], marginBottom: spacing[2] }}>
        <FontawesomeIcon name="paper-plane" color={color.palette.white} size={30}/>
      </View>
    </Send>
  )
}

export function renderInputToolbar(props: object): React.ReactElement {
  return (
    <InputToolbar
      {...props}
      containerStyle={CHAT_TEXT_INPUT_CONTAINER}
    />
  )
}

export function renderComposer(props: object): React.ReactElement {
  return (
    <Composer
      {...props}
      textInputStyle={COMPOSER}
      placeholderTextColor={color.palette.lightGrey}
      keyboardDismissMode="on-drag"
      keyboardAppearance="dark"
    />
  )
}

export function renderMessage(props: any): React.ReactElement {
  const { currentMessage: { text: currText } } = props

  let messageTextStyle

  // Make "pure emoji" messages much bigger than plain text.
  if (currText && emojiUtils.isPureEmojiString(currText)) {
    messageTextStyle = {
      fontSize: 28,
      // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
      lineHeight: Platform.Android ? 34 : 30
    }
  }

  return (
    <Message {...props} messageTextStyle={messageTextStyle}/>
  )
}
