import { reduce } from "ramda"
import * as React from "react"
import { View } from "react-native"
import { PRESETS } from "./form-row.presets"
import { IFormRowProps } from "./form-row.props"

/**
 * A horizontal container component used to hold a row of a form.
 */
export function FormRow(props: IFormRowProps): React.ReactElement {
  let viewStyle
  if (Array.isArray(props.style)) {
    viewStyle = reduce((acc: Object, term: Object) => {
      return { ...acc, ...term }
    }, PRESETS[props.preset], props.style)
  } else {
    viewStyle = {
      ...PRESETS[props.preset],
      ...props.style
    }
  }

  return (
    <View
      style={viewStyle}
    >
      {props.children}
    </View>
  )
}
