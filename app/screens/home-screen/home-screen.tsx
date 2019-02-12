import * as React from "react"
import { observer } from "mobx-react"
import { ViewStyle } from "react-native"
import { Button, Screen } from "@components"
import { color } from "@theme"
import { NavigationScreenProps } from "react-navigation"

export interface HomeScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background
}

@observer
export class HomeScreen extends React.Component<HomeScreenProps, {}> {
  render () {
    const { navigation } = this.props

    return (
      <Screen style={ROOT} preset="fixedCenter">
        <Button text={"aller vers l'AR"} onPress={() => {
          navigation.navigate("AugmentedRealityScreen")
        }}/>
      </Screen>
    )
  }
}
