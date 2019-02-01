import * as React from "react"
import { observer } from "mobx-react"
import { Image, ImageStyle, SafeAreaView, View, ViewStyle } from "react-native"
import { Button, Screen } from "@components"
import { TextField } from "@components/text-field"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import autobind from "autobind-decorator"
import { Text } from "@components/text"
import { Asset } from "@services/asset"
import { action, observable } from "mobx"
import throttle from "lodash.throttle"
import { inject } from "mobx-react/native"

export interface LoginScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

const FULL: ViewStyle = {
  ...ROOT,
  flex: 1,
}

const CONTAINER: ViewStyle = {
  ...FULL,
  paddingHorizontal: spacing[4],
}

const EXORUN_TEXT: ImageStyle = {
  width: 150,
  height: 50,
  alignSelf: "center",
}

const EXORUN_LOGO: ImageStyle = {
  width: 75,
  height: 35,
  alignSelf: "center",
}

const disabled = color.palette.lightGrey
const enabled = color.secondary

@inject("rootStore")
@observer
export class LoginScreen extends React.Component<LoginScreenProps, {}> {

  @observable email: string = null
  @observable password: string = null
  private readonly goBack: Function
  private readonly authorizeLogin: (event) => void

  constructor(props) {
    super(props)
    this.goBack = throttle(props.navigation.goBack, 3000)
    this.authorizeLogin = throttle(this._authorizeLogin, 5000)
  }

  @autobind
  _authorizeLogin() {

  }


  @action.bound
  setEmail(email: string) {
    this.email = email
  }

  @action.bound
  setPassword(password: string) {
    this.password = password
  }

  @autobind
  back() {
    this.goBack()
  }

  @autobind
  navigateToRegister() {
    const { navigation } = this.props
    navigation.navigate("register")
  }

  render() {
    const { email, password } = this
    let buttonColor
    if (email && password) {
      buttonColor = enabled
    } else {
      buttonColor = disabled
    }

    return (
      <View style={FULL}>
        <SafeAreaView style={FULL}>
          <Screen style={CONTAINER} backgroundColor={color.palette.backgroundDarker} preset="fixedStack">
            <Image
              source={Asset.Locator("exorun-text")}
              style={EXORUN_TEXT}
              resizeMode="contain"
            />
            <Image
              source={Asset.Locator("exorun-logo")}
              style={EXORUN_LOGO}
              resizeMode="contain"
            />
            <View style={{ alignItems: "center" }}>
              <TextField
                preset={"loginScreen"}
                placeholderTx="auth.login.username"
                inputStyle={{
                  backgroundColor: "transparent"
                }}
                placeholderTextColor={color.palette.lightGrey}
                onChangeText={this.setEmail}
              />
              <TextField
                preset={"loginScreen"}
                placeholderTx="auth.login.password"
                inputStyle={{
                  backgroundColor: "transparent"
                }}
                placeholderTextColor={color.palette.lightGrey}
                secureTextEntry={true}
                onChangeText={this.setPassword}
              />
              <View style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                marginTop: 25,
              }}>
                <Button style={{ width: "40%" }} onPress={this.back}>
                  <Text preset="bold" tx="auth.back"/>
                </Button>
                <Button
                  style={{ width: "40%", backgroundColor: buttonColor }}
                  onPress={this.authorizeLogin}
                  preset="primary"
                >
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
