import React from "react"
import { View } from "react-native"

export function ModalMock(props: { children: React.ReactNode }): React.ReactNode {
  return (
    <View>
      {props.children}
    </View>
  )
}
