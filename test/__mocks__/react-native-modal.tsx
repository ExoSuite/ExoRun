import React from "react"
import { View } from "react-native"

function ModalMock(props: { children: React.ReactNode }): React.ReactNode {
  return (
    <View>
      {props.children}
    </View>
  )
}

// tslint:disable-next-line:no-default-export
export default ModalMock
