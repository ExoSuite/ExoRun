import { mergeAll, flatten } from "ramda"
import * as React from "react"
import { View } from "react-native"
import { PRESETS } from "./form-row.presets"
import { IFormRowProps } from "./form-row.props"

/**
 * A horizontal container component used to hold a row of a form.
 */
export function FormRow(props: IFormRowProps): React.ReactElement {
  const viewStyle = mergeAll(flatten([PRESETS[props.preset], props.style]))

  return (
    <View
      style={viewStyle}
    >
      {props.children}
    </View>
  )
}
