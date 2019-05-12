import * as React from "react"
import { KeyboardAvoidingView, ScrollView, StatusBar, View, ViewStyle, SafeAreaView } from "react-native"
import { IScreenProps } from "./screen.props"
import { isNonScrolling, offsets, presets } from "./screen.presets"
import { Platform } from "@services/device"

interface IWrapperProps {
  children: React.ReactNode
  style: ViewStyle[]
  unsafe: boolean
}

function Wrapper(props: IWrapperProps): React.ReactElement {
  if (props.unsafe) {
    return (
      <View style={props.style}>
        {props.children}
      </View>
    )
  }

  return (
    <SafeAreaView style={props.style}>
      {props.children}
    </SafeAreaView>
  )
}

function ScreenWithoutScrolling(props: IScreenProps): React.ReactElement {
  const preset = presets[props.preset]
  const style = props.style || {}
  const backgroundStyle = props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}
  const behavior = Platform.iOS ? "padding" : null
  const barStyle = props.statusBar || "light-content"

  return (
    <KeyboardAvoidingView
      style={[preset.outer, backgroundStyle]}
      behavior={behavior}
      keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
    >
      <StatusBar barStyle={barStyle} />
      <Wrapper
        style={[preset.inner, style]}
        unsafe={props.unsafe}
      >
        {props.children}
      </Wrapper>
    </KeyboardAvoidingView>
  )
}

/**
 * This screen scrolls.
 *
 * @param props The screen props
 */
// tslint:disable-next-line typedef
function ScreenWithScrolling(props: IScreenProps) {
  const preset = presets.scroll
  const style = props.style || {}
  const backgroundStyle = props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}
  const behavior = Platform.iOS ? "padding" : null
  const barStyle = props.statusBar || "light-content"

  return (
    <KeyboardAvoidingView
      style={[preset.outer, backgroundStyle]}
      behavior={behavior}
      keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
    >
      <StatusBar barStyle={barStyle} />
      <Wrapper
        style={[preset.outer, backgroundStyle]}
        unsafe={props.unsafe}
      >
        <ScrollView
          style={[preset.outer, backgroundStyle]}
          contentContainerStyle={[preset.inner, style]}
        >
          {props.children}
        </ScrollView>
      </Wrapper>
    </KeyboardAvoidingView>
  )
}

/**
 * The starting component on every screen in the app.
 *
 * @param props The screen props
 */
export function Screen(props: IScreenProps): React.ReactElement {
  if (isNonScrolling(props.preset)) {
    return <ScreenWithoutScrolling {...props} />
  }

  return <ScreenWithScrolling {...props} />
}
