import React from "react"
import { Text } from "@components/text"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { View, ViewStyle } from "react-native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  padding: spacing[6],
  flex: 1,
  justifyContent: "space-evenly"
}

// tslint:disable-next-line: completed-docs
export class CheckpointsNewRunScreen extends React.Component {

  public static navigationOptions = {
    headerTitle: <Text tx="checkpoint.from-run" preset="lightHeader"/>,
    headerLeft: NavigationBackButtonWithNestedStackNavigator({
      iconName: "chevron-down"
    })
  }

  public render(): React.ReactNode {
    return (
      <View style={ROOT}/>
    )
  }
}
