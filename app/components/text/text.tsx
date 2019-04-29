import { translate } from "@i18n"
import { reduce } from "ramda"
import * as React from "react"
import { Text as ReactNativeText } from "react-native"
import { presets } from "./text.presets"
import { ITextProps } from "./text.props"

/**
 * For your text displaying needs.
 *
 * This component Is a HOC over the built-in React Native one.
 */
// tslint:disable-next-line typedef
export function Text(props: ITextProps) {
  // grab the props
  const { preset = "default", tx, text, children, style: styleOverride, ...rest } = props

  // figure out which content to use
  const i18nText = tx && translate(tx)
  const content = i18nText || text || children

  // assemble the style
  const presetToUse = presets[preset] || presets.default
  let style
  if (Array.isArray(styleOverride)) {
    style = reduce((acc: Object, term: Object) => {
      return { ...acc, ...term }
    }, presetToUse, styleOverride)
  } else {
    style = { ...presetToUse, ...styleOverride }
  }

  return (
    <ReactNativeText {...rest} style={style}>
      {content}
    </ReactNativeText>
  )
}
