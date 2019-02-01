import * as React from "react"
import { SafeAreaView, TextStyle, View, ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { observer } from "mobx-react"
import { Button, Header, Screen } from "@components"
import { color, spacing } from "@theme"
import autobind from "autobind-decorator"

export interface RegisterScreenProps extends NavigationScreenProps<{}> {
}

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.palette.black
}

const CONTAINER: ViewStyle = {
  ...FULL,
  paddingHorizontal: spacing[4]
}

const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: 0
}

const BOLD: TextStyle = { fontWeight: "bold" }

const HEADER_TITLE: TextStyle = {
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5
}

// @inject("mobxstuff")
@observer
export class RegisterScreen extends React.Component<RegisterScreenProps, {}> {

  @autobind
  goBack() {
    const { navigation } = this.props
    navigation.goBack(null)
  }

  render() {
    const { goBack } = this

    return (
      <View style={FULL}>
        <SafeAreaView style={FULL}>
          <Screen style={CONTAINER} backgroundColor={color.transparent} preset="fixedStack">
            <Header
              headerTx="auth.register.header"
              leftIcon="back"
              onLeftPress={goBack}
              style={HEADER}
              titleStyle={HEADER_TITLE}
            />
            <Button tx="auth.register.register"/>
          </Screen>
        </SafeAreaView>
      </View>
    )
  }
}
