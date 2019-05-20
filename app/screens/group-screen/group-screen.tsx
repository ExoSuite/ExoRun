import * as React from "react"
import { observer } from "mobx-react"
import { ViewStyle } from "react-native"
import { Screen, Text, TextField } from "@components"
import { color } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { RightNavigationButton } from "@navigation/components/right-navigation-button"
import { AppScreens } from "@navigation/navigation-definitions"

export interface IGroupScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1
}

const SEARCH: ViewStyle = {
  backgroundColor: color.backgroundDarkerer
}

const HeaderRight = RightNavigationButton({ modalScreen: AppScreens.NEW_GROUP })

// tslint:disable-next-line: completed-docs
@observer
export class GroupScreen extends React.Component<IGroupScreenProps> {

  public static navigationOptions = {
    headerRight: <HeaderRight/>
  }

// tslint:disable-next-line: prefer-function-over-method
  public render(): React.ReactNode {
    return (
      <Screen style={ROOT} preset="fixed">
        <TextField
          placeholder="Nom de groupe"
        />
      </Screen>
    )
  }
}
