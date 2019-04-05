import * as React from "react"
import { Image, ImageStyle, SafeAreaView, TextInput, TextStyle, View, ViewStyle } from "react-native"
import {
  AnimatedInteractiveInput,
  booleanToInputState,
  Button,
  DismissKeyboard,
  FormRow,
  Header,
  PressableText,
  Screen,
  Text
} from "@components"
import { DataLoader } from "@components/data-loader"
import { HttpRequestError } from "@exceptions"
import { Api, ITokenResponse } from "@services/api"
import { Server } from "@services/api/api.servers"
import { Asset } from "@services/asset"
import { Platform } from "@services/device"
import { Injection } from "@services/injections"
import { SoundPlayer } from "@services/sound-player"
import { color, spacing } from "@theme"
import { save } from "@utils/keychain"
import { ApiResponse } from "apisauce"
import autobind from "autobind-decorator"
import { isEmpty, throttle } from "lodash-es"
import { action, observable } from "mobx"
import { observer } from "mobx-react"
import { inject } from "mobx-react/native"
import { KeyboardAccessoryView } from "react-native-keyboard-accessory"
import KeyboardSpacer from "react-native-keyboard-spacer"
import { NavigationScreenProps } from "react-navigation"
import { IValidationRules, validate } from "@utils/validate"
import { footerShadow } from "@utils/shadows"
import { AppScreens } from "@navigation/navigation-definitions"
import { IVoidFunction } from "@types"

export interface ILoginScreenProps extends NavigationScreenProps<{}> {
  api: Api,
  soundPlayer: SoundPlayer
}

const EXOSUITE: ImageStyle = {
  width: 200,
  height: 100
}

const ZERO_PADDING: ViewStyle = {
  padding: 0
}

const FOOTER_CONTAINER: ViewStyle = {
  flexDirection: "row",
  alignSelf: "center",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: color.background,
  width: "100%"
}

const BOLD: TextStyle = { fontWeight: "bold" }

const HEADER: TextStyle = {
  paddingTop: spacing[2],
  paddingBottom: spacing[2],
  backgroundColor: color.palette.backgroundDarkerer
}
const HEADER_TITLE: TextStyle = {
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5
}

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundDarkerer
}

const CONTAINER: ViewStyle = {
  ...FULL,
  paddingVertical: spacing[6],
  paddingHorizontal: spacing[4],
  flexGrow: 1,
  justifyContent: "space-evenly"
}

const KEYBOARD_ACCESSORY_VIEW: ViewStyle = {
  backgroundColor: color.backgroundDarkerer,
  borderTopWidth: 0,
  ...footerShadow
}

const KEYBOARD_ACCESSORY_VIEW_ROW_CONTAINER: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: spacing[2],
  paddingRight: spacing[2]
}

const LOGIN_BUTTON: ViewStyle = {
  alignSelf: "flex-end",
  maxWidth: "35%",
  minWidth: "20%",
  margin: spacing[1]
}

const RESET_PASSWORD: TextStyle = {
  color: color.palette.lightBlue
}

const TRANSPARENT: ViewStyle = {
  backgroundColor: color.transparent
}

const MAIN_CONTAINER: ViewStyle = {
  marginBottom: spacing[4]
}

const TITLE: ViewStyle = {
  paddingTop: spacing[3],
  backgroundColor: color.background
}

const disabled = color.palette.lightGrey
const enabled = color.secondary
const hidePassword = "common.password-hide"
const revealPassword = "common.password-reveal"

const onResetPasswordPress = (): null => null

const RULES: IValidationRules = { email: { email: true } }

/**
 * LoginScreen will handle multiple user login
 * by calling the ExoSuite Users API
 */
@inject(Injection.Api, Injection.SoundPlayer)
@observer
export class LoginScreen extends React.Component<ILoginScreenProps> {

  private readonly authorizeLogin: IVoidFunction
  @observable private email: string = null
  private readonly goBack: Function
  @observable private isPasswordVisible = false
  @observable private isValidEmail = false
  @observable private password: string = null
  private passwordInputRef: TextInput

  constructor(props: ILoginScreenProps) {
    super(props)
    this.goBack = throttle(props.navigation.goBack, 3000)
    this.authorizeLogin = throttle(this._authorizeLogin, 5000)
  }

  @action.bound
  private emailValidator(): void {
    const { email } = this
    this.email === null ?
      this.isValidEmail = false :
      this.isValidEmail = isEmpty(validate(RULES, { email }))
  }

  private manageResponseError(response: HttpRequestError): void {
    const { soundPlayer } = this.props
    DataLoader.Instance.hasErrors(response, soundPlayer.error)
  }

  @autobind
  private onEmailPressNext(): void {
    this.passwordInputRef.focus()
  }

  @action.bound
  private setEmail(email: string): void {
    this.email = email
    this.emailValidator()
  }

  @action.bound
  private setPassword(password: string): void {
    this.password = password
  }

  @autobind
  private setPasswordInputRef(ref: TextInput): void {
    this.passwordInputRef = ref
  }

  @action.bound
  private toggleIsPasswordVisible(): void {
    this.isPasswordVisible = !this.isPasswordVisible
  }

  @autobind
  public async _authorizeLogin(): Promise<void> {
    const { api, soundPlayer, navigation } = this.props
    DataLoader.Instance.toggleIsVisible()

    const response: ApiResponse<ITokenResponse> | HttpRequestError =
      await api.login(this.email, this.password)
        .catch((error: HttpRequestError): HttpRequestError => error)

    if (response instanceof HttpRequestError) {
      this.manageResponseError(response)

      return
    }

    DataLoader.Instance.success(
      soundPlayer.success,
      async () => {
        await save(response.data, Server.EXOSUITE_USERS_API)
        navigation.navigate(AppScreens.HOME)
      })
  }

  @autobind
  public back(): void {
    this.goBack()
  }

  public render(): React.ReactNode {
    const {
      email,
      password,
      isPasswordVisible,
      toggleIsPasswordVisible,
      emailValidator,
      isValidEmail
    } = this

    let buttonColor
    email && password && isValidEmail ? buttonColor = enabled : buttonColor = disabled
    const passwordToggleText = isPasswordVisible ? hidePassword : revealPassword

    const emailInputState = booleanToInputState(isValidEmail)
    const passwordInputState = booleanToInputState(!isEmpty(password))

    return (
      <DismissKeyboard>
        <SafeAreaView style={FULL}>
          <Header
            leftIcon="chevron-left"
            leftIconType="solid"
            leftIconSize={20}
            leftIconColor={color.palette.lightBlue}
            onLeftPress={this.back}
            style={HEADER}
            titleStyle={HEADER_TITLE}
          />

          <FormRow preset={"clear"} style={TITLE}>
            <Text tx="auth.login.login" preset="headerCentered" allowFontScaling/>
          </FormRow>

          {/* Email / Password / Login button */}
          <Screen style={CONTAINER} backgroundColor={color.background} preset="fixed">

            <FormRow preset="clearFullWidth" style={MAIN_CONTAINER}>

              <AnimatedInteractiveInput
                preset="auth"
                autoCapitalize="none"
                placeholderTx="common.username"
                inputStyle={TRANSPARENT}
                withBottomBorder
                inputState={emailInputState}
                onEndEditing={emailValidator}
                placeholderTextColor={color.palette.lightGrey}
                onChangeText={this.setEmail}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={this.onEmailPressNext}
                autoFocus
              />

              <AnimatedInteractiveInput
                preset="auth"
                autoCapitalize="none"
                placeholderTx="common.password"
                withBottomBorder
                inputState={passwordInputState}
                inputStyle={TRANSPARENT}
                placeholderTextColor={color.palette.lightGrey}
                secureTextEntry={!isPasswordVisible}
                onChangeText={this.setPassword}
                returnKeyType="send"
                forwardedRef={this.setPasswordInputRef}
                onSubmitEditing={this.authorizeLogin}
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
                style={RESET_PASSWORD}
                onPress={onResetPasswordPress}
              />
              <Button
                style={{
                  backgroundColor: buttonColor,
                  ...LOGIN_BUTTON
                }}
                onPress={this.authorizeLogin}
                disabled={buttonColor !== enabled} // can we press on the login button?
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
