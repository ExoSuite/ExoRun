import * as React from "react"
import { observer } from "mobx-react"
import { ViewStyle } from "react-native"
import { Text } from "@components/text"
import { Screen } from "@components/screen"
import { color } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"

export interface INewGroupScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background,
}

// @inject("mobxstuff")
@observer
export class NewGroupScreen extends React.Component<INewGroupScreenProps> {

  public static navigationOptions = {
    headerTitle: <Text tx="common.new-group" preset="header"/>,
    headerLeft: NavigationBackButtonWithNestedStackNavigator({
      iconName: "chevron-down",
    })
  }

  public render(): React.ReactNode {
    return (
      <Screen style={ROOT} preset="fixed">
        <Text preset="header" tx="newGroupScreen.header" />
      </Screen>
    )
  }
}
