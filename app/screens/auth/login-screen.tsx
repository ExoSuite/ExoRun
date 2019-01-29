import * as React from "react"
import { observer } from "mobx-react"
import { Image, ImageStyle, SafeAreaView, View, ViewStyle } from "react-native"
import { Screen } from "app/components/screen"
import { color, spacing } from "app/theme"
import { NavigationScreenProps } from "react-navigation"
import autobind from "autobind-decorator"
import { TextField, PRESETS } from "app/components/text-field"
import { Text } from "app/components/text"
import { AssetLocator } from "app/services/asset"
import { Button } from "app/components/button"
import { action, observable } from "mobx"
import throttle from "lodash.throttle"
import { inject } from "mobx-react/native"

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

@inject('rootStore')
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
                inputStyle={PRESETS.transparentInput}
                onChangeText={this.setEmail}
              />
              <TextField
                preset={"loginScreen"}
                placeholderTx="auth.login.password"
                placeholderTextColor={color.palette.lightGrey}
                inputStyle={PRESETS.transparentInput}
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
