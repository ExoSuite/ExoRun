import { reduce } from "ramda"
import * as React from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { color, spacing } from "@theme"
import { Text } from "../text"
import { ICheckboxProps } from "./checkbox.props"

const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingVertical: spacing[1],
  alignSelf: "flex-start",
}

const DIMENSIONS = { width: 16, height: 16 }

const OUTLINE: ViewStyle = {
  ...DIMENSIONS,
  marginTop: 2, // finicky and will depend on font/line-height/baseline/weather
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: color.primaryDarker,
  borderRadius: 1,
}

const FILL: ViewStyle = {
  width: DIMENSIONS.width - 4,
  height: DIMENSIONS.height - 4,
  backgroundColor: color.primary,
}

const LABEL: TextStyle = { paddingLeft: spacing[2] }

// tslint:disable-next-line: typedef
export function Checkbox(props: ICheckboxProps) {
  const numberOfLines = props.multiline ? 0 : 1

  let rootStyle
  if (Array.isArray(props.style)) {
    rootStyle = reduce((acc: Object, term: Object) => {
      return { ...acc, ...term }
    }, ROOT, props.style)
  } else {
    rootStyle = { ...ROOT, ...props.style } as ViewStyle
  }

  let outlineStyle
  if (Array.isArray(props.outlineStyle)) {
    outlineStyle = reduce((acc: Object, term: Object) => {
      return { ...acc, ...term }
    }, OUTLINE, props.outlineStyle)
  } else {
    outlineStyle = { ...OUTLINE, ...props.outlineStyle } as ViewStyle
  }

  let fillStyle
  if (Array.isArray(props.fillStyle)) {
    fillStyle = reduce((acc: Object, term: Object) => {
      return { ...acc, ...term }
    }, FILL, props.fillStyle)
  } else {
    fillStyle = { ...FILL, ...props.fillStyle } as ViewStyle
  }

  const onPress = (): void => {
    if (props.onToggle) {
      props.onToggle(!props.value)
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={!props.onToggle}
      onPress={onPress}
      style={rootStyle}
    >
      <View style={outlineStyle}>{props.value && <View style={fillStyle}/>}</View>
      <Text text={props.text} tx={props.tx} numberOfLines={numberOfLines} style={LABEL}/>
    </TouchableOpacity>
  )
}
