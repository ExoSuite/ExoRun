import * as React from "react"
import { KeyboardAvoidingView, Platform, ViewStyle } from "react-native"

const ROOT: ViewStyle = { backgroundColor: "#f0f0f0", flex: 1 }

export interface IStoryScreenProps {
  children?: React.ReactNode
}

const behavior = Platform.OS === "ios" ? "padding" : null
// tslint:disable-next-line
export const StoryScreen = (props: IStoryScreenProps) => (
  <KeyboardAvoidingView style={ROOT} behavior={behavior} keyboardVerticalOffset={50}>
    {props.children}
  </KeyboardAvoidingView>
)
