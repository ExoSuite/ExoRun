// library imports
import * as React from "react"
import { observer } from "mobx-react"
import {
  Image,
  ImageStyle,
  SafeAreaView,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { action, observable } from "mobx"
import { inject } from "mobx-react/native"
import { NavigationScreenProps } from "react-navigation"
import throttle from "lodash.throttle"
import autobind from "autobind-decorator"
import KeyboardSpacer from "react-native-keyboard-spacer"
import validator from "validate.js"
import { KeyboardAccessoryView } from "react-native-keyboard-accessory"
// custom imports
import { Button, DismissKeyboard, Header, PressableText, Screen, Text, TextField } from "@components"
import { color, spacing } from "@theme"
import { Asset } from "@services/asset"
import { FormRow } from "@components/form-row"
import { Api, ITokenResponse } from "@services/api"
import { Injection } from "@services/injections"
import { SoundPlayer } from "@services/sound-player"
import { DataLoader } from "@components/data-loader"
import { HttpRequestError } from "@exceptions"
import { Platform } from "@services/device"
import { ApiResponse } from "apisauce"
import { save } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { palette } from "@theme/palette"

export interface LoginScreenProps extends NavigationScreenProps<{}> {
  api: Api,
  soundPlayer: SoundPlayer
}

const EXOSUITE: ImageStyle = {
  width: 200,
  height: 100,
}

const EXTRA_PADDING_TOP: ViewStyle = {
  paddingTop: spacing[3],
}

const ZERO_PADDING: ViewStyle = {
  padding: 0,
}

const FOOTER_CONTAINER: ViewStyle = {
  flexDirection: "row",
  alignSelf: "center",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: color.background,
  width: "100%",
}

const EMAIL_TEXT: TextStyle = {
  paddingTop: spacing[5],
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
  backgroundColor: color.backgroundDarkerer,
}

const CONTAINER: ViewStyle = {
  ...FULL,
  paddingHorizontal: spacing[4],
  flexGrow: 1,
  justifyContent: "space-evenly",
}

const KEYBOARD_ACCESSORY_VIEW: ViewStyle = {
  backgroundColor: color.backgroundDarkerer,
  marginTop: spacing[2],
  marginBottom: spacing[2],
  paddingLeft: spacing[1],
  paddingRight: spacing[1],
  paddingTop: spacing[1],
}

const KEYBOARD_ACCESSORY_VIEW_ROW_CONTAINER: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: spacing[2],
  paddingRight: spacing[2],
}

const disabled = color.palette.lightGrey
const enabled = color.secondary
const hidePassword = "auth.login.password-hide"
const revealPassword = "auth.login.password-reveal"

@inject(Injection.Api, Injection.SoundPlayer)
@observer
export class LoginScreen extends React.Component<LoginScreenProps, {}> {

  @observable email: string = null
  @observable password: string = null
  @observable isPasswordVisible = false
  @observable isValidEmail = false

  private readonly goBack: Function
  private readonly authorizeLogin: (event) => void

  constructor(props) {
    super(props)
    this.goBack = throttle(props.navigation.goBack, 3000)
    this.authorizeLogin = throttle(this._authorizeLogin, 5000)
  }

  private manageResponseError(response: HttpRequestError) {
    const { soundPlayer } = this.props
    DataLoader.instance.hasErrors(response, () => soundPlayer.error())
  }

  @autobind
  async _authorizeLogin() {
    const { api, soundPlayer, navigation } = this.props
    DataLoader.instance.toggleIsVisible()

    const response: ApiResponse<ITokenResponse> | HttpRequestError =
      await api.login(this.email, this.password).catch((e: HttpRequestError) => e)

    if (response instanceof HttpRequestError) {
      this.manageResponseError(response)
    } else {
      DataLoader.instance.success(() => soundPlayer.success(), async () => {
        await save(response.data, Server.EXOSUITE_USERS_API)
        navigation.navigate("HomeScreen")
      })
    }
  }

  @action.bound
  toggleIsPasswordVisible() {
    this.isPasswordVisible = !this.isPasswordVisible
  }

  @action.bound
  setEmail(email: string) {
    this.email = email
    this.emailValidator()
  }

  @action.bound
  setPassword(password: string) {
    this.password = password
  }

  @autobind
  back() {
    this.goBack()
  }

  @action.bound
  emailValidator() {
    this.isValidEmail = !(validator.validate(
      { email: this.email },
      { email: { email: true } },
    ) !== undefined)
  }

  @autobind
  RenderIsValidEmail() {
    if (!this.isValidEmail && this.email != null) {
      return <Text
        tx={"auth.login.bad-email"}
        style={[{ color: color.palette.orange }, EMAIL_TEXT]
        }/>
    } else if (this.isValidEmail && this.email) {
      return <Text
        tx={"auth.login.good-email"}
        style={[{ color: color.palette.green }, EMAIL_TEXT]}
      />
    }
    return null
  }

  render() {
    const {
      email,
      password,
      isPasswordVisible,
      toggleIsPasswordVisible,
      emailValidator,
      RenderIsValidEmail,
      isValidEmail,
    } = this
    let buttonColor
    if (email && password && isValidEmail) {
      buttonColor = enabled
    } else {
      buttonColor = disabled
    }

    const passwordToggleText = isPasswordVisible ? hidePassword : revealPassword

    return (
      <DismissKeyboard>
        <SafeAreaView style={FULL}>
          <Header
            leftIcon="chevron-left"
            leftIconType="solid"
            leftIconSize={20}
            leftIconColor={color.palette.lightBlue}
            onLeftPress={() => this.goBack()}
            style={HEADER}
            titleStyle={HEADER_TITLE}
          />

          <FormRow preset={"clear"} style={[EXTRA_PADDING_TOP, { backgroundColor: color.background }]}>
            <Text tx="auth.login.login" preset="headerCentered" allowFontScaling/>
          </FormRow>

          {/* Email / Password / Login button */}
          <Screen style={CONTAINER} backgroundColor={color.background} preset="fixed">

            <FormRow preset={"clearFullWidth"} style={{ marginBottom: spacing[4] }}>
              <RenderIsValidEmail/>
              <TextField
                preset={"loginScreen"}
                autoCapitalize={"none"}
                placeholderTx="auth.login.username"
                inputStyle={{ backgroundColor: "transparent" }}
                onEndEditing={emailValidator}
                placeholderTextColor={color.palette.lightGrey}
                onChangeText={this.setEmail}
              />

              <TextField
                preset={"loginScreen"}
                placeholderTx="auth.login.password"
                inputStyle={{ backgroundColor: "transparent" }}
                placeholderTextColor={color.palette.lightGrey}
                secureTextEntry={!isPasswordVisible}
                onChangeText={this.setPassword}
              />
              <FormRow preset={"clear"} style={[ZERO_PADDING, { paddingTop: spacing[2] }]}>
                <Button preset="link" tx={passwordToggleText} onPress={toggleIsPasswordVisible}/>
              </FormRow>
            </FormRow>

            {Platform.iOS && <KeyboardSpacer/>}
          </Screen>

          {Platform.iOS && (
            <View style={FOOTER_CONTAINER}>
              <Text preset="bold" tx="auth.powered"/>
              <Image
                source={Asset.Locator("exosuite-logo")}
                style={EXOSUITE}
                resizeMode="contain"
              />
            </View>
          )}

          <KeyboardAccessoryView
              alwaysVisible
              style={KEYBOARD_ACCESSORY_VIEW}
              inSafeAreaView
              androidAdjustResize
          >
            <View style={KEYBOARD_ACCESSORY_VIEW_ROW_CONTAINER}>
              <PressableText
                preset="bold"
                tx="auth.login.reset-password"
                style={{color: palette.lightBlue}}
                onPress={() => {}}
              />
              <Button
                style={{ backgroundColor: buttonColor, alignSelf: "flex-end", maxWidth: "30%", minWidth: "20%" }}
                onPress={this.authorizeLogin}
                disabled={buttonColor != enabled} // can we press on the login button?
                preset="primaryFullWidth"
              >
                <Text preset="bold" tx="auth.login.header"/>
              </Button>
            </View>
          </KeyboardAccessoryView>

        </SafeAreaView>
      </DismissKeyboard>

    )
  }
}
