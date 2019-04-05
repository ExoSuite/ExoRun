import * as React from "react"
import { ScrollView, View, ViewStyle } from "react-native"

export interface IStoryProps {
  children?: React.ReactNode
}

const ROOT: ViewStyle = { flex: 1 }

// tslint:disable-next-line typedef
export function Story(props: IStoryProps) {
  return (
    <View style={ROOT}>
      <ScrollView>{props.children}</ScrollView>
    </View>
  )
}
