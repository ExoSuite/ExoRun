import * as React from "react"
import { observer } from "mobx-react"
import { Image, ImageStyle, SafeAreaView, View, ViewStyle } from "react-native"
import { Screen } from "app/components/screen"
import { color, spacing } from "app/theme"
import { NavigationScreenProps } from "react-navigation"
import autobind from "autobind-decorator"
import { TextField } from "app/components/text-field"
import { Text } from "app/components/text"
import { AssetLocator } from "app/services/asset"
import { Button } from "app/components/button"
import { action, observable } from "mobx"

export interface LoginScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black
}

const FULL: ViewStyle = {
  ...ROOT,
  flex: 1
}

const CONTAINER: ViewStyle = {
  ...FULL,
  paddingHorizontal: spacing[4]
}

const EXORUN_TEXT: ImageStyle = {
  width: 150,
  height: 50,
  alignSelf: "center"
}

const EXORUN_LOGO: ImageStyle = {
  width: 75,
  height: 35,
  alignSelf: "center"
}

const disabled = color.palette.lightGrey
const enabled = color.secondary

@observer
export class LoginScreen extends React.Component<LoginScreenProps, {}> {

  @observable username: string = null
  @observable password: string = null

  @action.bound
  setUsername(username: string) {
    this.username = username
  }

  @action.bound
  setPassword(password: string) {
    this.password = password
  }

  @autobind
  back() {
    const { navigation } = this.props
    navigation.goBack(null)
  }

  @autobind
  navigateToRegister() {
    const { navigation } = this.props
    navigation.navigate("register")
  }

  render() {
    const { username, password } = this
    let buttonColor
    if (username && password) {
      buttonColor = enabled
    } else {
      buttonColor = disabled
    }

    return (
      <View style={FULL}>
        <SafeAreaView style={FULL}>
          <Screen style={CONTAINER} backgroundColor={color.palette.backgroundDarker} preset="fixedStack">
            <Image
              source={AssetLocator("exorun-text")}
              style={EXORUN_TEXT}
              resizeMode="contain"
            />
            <Image
              source={AssetLocator("exorun-logo")}
              style={EXORUN_LOGO}
              resizeMode="contain"
            />
            <View style={{ alignItems: "center" }}>
              <TextField
                preset={"loginScreen"}
                placeholderTx="auth.login.username"
                placeholderTextColor={color.palette.lightGrey}
                inputStyle={{ backgroundColor: color.palette.backgroundDarkerer }}
                onChangeText={this.setUsername}
              />
              <TextField
                preset={"loginScreen"}
                placeholderTx="auth.login.password"
                placeholderTextColor={color.palette.lightGrey}
                inputStyle={{ backgroundColor: color.palette.backgroundDarkerer }}
                secureTextEntry={true}
                onChangeText={this.setPassword}
              />
              <View style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                marginTop: 25
              }}>
                <Button style={{ width: "40%" }} onPress={this.back} preset="neutral">
                  <Text preset="bold" tx="auth.back"/>
                </Button>
                <Button style={{ width: "40%", backgroundColor: buttonColor }} onPress={() => {
                }} preset="primary">
                  <Text preset="bold" tx="auth.login.header"/>
                </Button>

              </View>
            </View>

          </Screen>
        </SafeAreaView>
      </View>
    )
  }
}
