import * as React from "react"
import { Text as ReactNativeText } from "react-native"
import { presets } from "./text.presets"
import { ITextProps } from "./text.props"
import { translate } from "@i18n"
import { mergeAll, flatten } from "ramda"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Text(props: ITextProps): React.ReactElement {
  // grab the props
  const { preset = "default", tx, text, children, style: styleOverride, ...rest } = props

  // figure out which content to use
  const i18nText = tx && translate(tx)
  const content = i18nText || text || children

  const style = mergeAll(flatten([presets[preset] || presets.default, styleOverride]))

  return (
    <ReactNativeText
      // @ts-ignore
      style={style}
      {...rest}
    >
      {content}
    </ReactNativeText>
  )
}
