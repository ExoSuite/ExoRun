import * as React from "react"
import { ScrollView, View, ViewStyle } from "react-native"
import { isNonScrolling, presets } from "./screen.presets"
import { IScreenProps } from "./screen.props"

/**
 * This screen does not scroll.
 *
 * @param props The screen props
 */
// tslint:disable-next-line typedef
function ScreenWithoutScrolling(props: IScreenProps) {
  const preset = presets[props.preset] || presets.fixed
  const style = { ...preset.nonScroll, ...props.style }
  const backgroundStyle = props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}

  return <View style={[style, backgroundStyle]}>{props.children}</View>
}

/**
 * This screen scrolls.
 *
 * @param props The screen props
 */
// tslint:disable-next-line typedef
function ScreenWithScrolling(props: IScreenProps) {
  const preset = presets[props.preset] || presets.scroll
  const outerStyle = preset.scrollOuter
  const backgroundStyle = props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}
  const innerStyle = { ...preset.scrollInner, ...props.style } as ViewStyle

  return (
    <ScrollView style={[outerStyle, backgroundStyle]} contentContainerStyle={innerStyle}>
      {props.children}
    </ScrollView>
  )
}

/**
 * The starting component on every screen in the app.
 *
 * @param props The screen props
 */
// tslint:disable-next-line typedef
export function Screen(props: IScreenProps) {
  if (isNonScrolling(props.preset)) {
    return <ScreenWithoutScrolling {...props} />
  }

  return <ScreenWithScrolling {...props} />
}
