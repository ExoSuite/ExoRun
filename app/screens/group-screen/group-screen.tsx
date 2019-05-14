import * as React from "react"
import { observer } from "mobx-react"
import { ViewStyle } from "react-native"
import { Screen, Text } from "@components"
import { color } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { AddNewButton } from "@navigation/components/add-new-button"
import { AppScreens } from "@navigation/navigation-definitions"

export interface IGroupScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black
}

const HeaderRight = AddNewButton({modalScreen: AppScreens.NEW_GROUP})

// tslint:disable-next-line: completed-docs
@observer
export class GroupScreen extends React.Component<IGroupScreenProps> {

  public static navigationOptions = {
    headerRight: <HeaderRight/>
  }

// tslint:disable-next-line: prefer-function-over-method
  public render(): React.ReactNode {
    return (
      <Screen style={ROOT} preset="fixedCenter">
        <Text preset="header" text="GROUP"/>
      </Screen>
    )
  }
}
