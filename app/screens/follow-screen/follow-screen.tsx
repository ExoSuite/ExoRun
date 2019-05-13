import * as React from "react"
import { observer } from "mobx-react"
import { ViewStyle } from "react-native"
import { Text } from "@components/text"
import { Screen } from "@components/screen"
import { color } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"

export interface IFollowScreenNavigationScreenProps {
  user: {
    id: string
  }
}

export interface IFollowScreenProps extends NavigationScreenProps<IFollowScreenNavigationScreenProps> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background,
}

// @inject("mobxstuff")
@observer
export class FollowScreen extends React.Component<IFollowScreenProps> {

  public static navigationOptions = {
    headerLeft: NavigationBackButtonWithNestedStackNavigator()
  }

  public render(): React.ReactNode {
    return (
      <Screen style={ROOT} preset="scroll">
        <Text preset="header" tx="followScreen.header" />
      </Screen>
    )
  }
}
