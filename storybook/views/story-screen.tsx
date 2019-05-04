import * as React from "react"
import { SafeAreaView, ViewStyle } from "react-native"

const ROOT: ViewStyle = { backgroundColor: "#f0f0f0", flex: 1 }

export interface IStoryScreenProps {
  children?: React.ReactNode
}

// tslint:disable-next-line
export const StoryScreen = (props: IStoryScreenProps) => (
  <SafeAreaView style={ROOT}>
    {props.children}
  </SafeAreaView>
)
