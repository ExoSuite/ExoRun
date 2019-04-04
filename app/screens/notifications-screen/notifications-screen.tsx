import * as React from "react"
import { observer } from "mobx-react"
import { ViewStyle } from "react-native"
import { Screen, Text } from "@components"
import { color } from "@theme"
import { NavigationScreenProps } from "react-navigation"

export interface INotificationsScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black
}

// @inject("mobxstuff")
// tslint:disable-next-line: completed-docs
@observer
export class NotificationsScreen extends React.Component<INotificationsScreenProps> {
// tslint:disable-next-line: prefer-function-over-method
  public render(): React.ReactNode {
    return (
      <Screen style={ROOT} preset="fixedCenter">
        <Text preset="header" tx="notificationsScreen.header"/>
      </Screen>
    )
  }
}
