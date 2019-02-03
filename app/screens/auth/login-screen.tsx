// library imports
import * as React from "react"
import { observer } from "mobx-react"
import {
  Image,
  ImageStyle,
  Keyboard,
  SafeAreaView,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from "react-native"
import { action, observable } from "mobx"
import { inject } from "mobx-react/native"
import { NavigationScreenProps } from "react-navigation"
import throttle from "lodash.throttle"
import autobind from "autobind-decorator"
import KeyboardSpacer from "react-native-keyboard-spacer"

// custom imports
import { Button, Screen, TextField, Text, Header } from "@components"
import { color, spacing } from "@theme"
import { Asset } from "@services/asset"
import { Injection } from "@services/injections"
import { Environment } from "@models/environment"
import { FormRow } from "@components/form-row"

export interface LoginScreenProps extends NavigationScreenProps<{}> {
  env: Environment
}

const EXOSUITE: ImageStyle = {
  width: 200,
  height: 100,
}

const EXTRA_PADDING_TOP: ViewStyle = {
  paddingTop: spacing[5]
}

const FOOTER_CONTAINER: ViewStyle = {
  flexDirection: "row",
  alignSelf: "center",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor:  color.background,
  width: '100%'
}

const BOLD: TextStyle = { fontWeight: "bold" }

const HEADER: TextStyle = {
  paddingTop: spacing[2],
  paddingBottom: spacing[2],
  backgroundColor: color.palette.backgroundDarkerer,
}
const HEADER_TITLE: TextStyle = {
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.palette.backgroundDarkerer
}

const CONTAINER: ViewStyle = {
  ...FULL,
  paddingHorizontal: spacing[4],
  flexGrow: 1,
  justifyContent: "space-evenly"
}

const EXORUN_TEXT: ImageStyle = {
  width: 150,
  height: 50,
  alignSelf: "center",
}

const disabled = color.palette.lightGrey
const enabled = color.secondary

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

@inject(Injection.Environment)
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
  async _authorizeLogin() {
    const {api} = this.props.env;
    await api.login(this.email, this.password).catch((e: Error) => console.tron.log('COUCOU', e.message))
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
      <DismissKeyboard>
        <SafeAreaView style={FULL}>
          <Header
            leftIcon="chevron-left"
            leftIconType="solid"
            leftIconSize={20}
            onLeftPress={() => this.goBack()}
            style={HEADER}
            titleStyle={HEADER_TITLE}
          />
          <Screen style={CONTAINER} backgroundColor={color.background} preset="fixed">

            <FormRow preset={"clear"} style={EXTRA_PADDING_TOP}>
              <Text tx="auth.login.login" preset="header"/>
            </FormRow>

            <FormRow preset={"clearFullWidth"}>
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
            </FormRow>

            <FormRow preset="clearFullWidth" style={EXTRA_PADDING_TOP}>
              <Button
                style={{ backgroundColor: buttonColor }}
                onPress={this.authorizeLogin}
                disabled={buttonColor != enabled}
                preset="primaryFullWidth"
              >
                <Text preset="bold" tx="auth.login.header"/>
              </Button>
            </FormRow>
            <KeyboardSpacer/>
          </Screen>
          <View style={FOOTER_CONTAINER}>
            <Text preset="bold" tx="auth.powered"/>
            <Image
              source={Asset.Locator("exosuite-logo")}
              style={EXOSUITE}
              resizeMode="contain"
            />
          </View>

        </SafeAreaView>
      </DismissKeyboard>

    )
  }
}
