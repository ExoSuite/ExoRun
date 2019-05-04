import * as React from "react"
import { inject, observer } from "mobx-react/native"
import { Image, ImageStyle, SafeAreaView, TextInput, View, ViewStyle } from "react-native"
import { KeyboardAccessoryView } from "react-native-keyboard-accessory"
import KeyboardSpacer from "react-native-keyboard-spacer"
import { NavigationScreenProps } from "react-navigation"
import { action, observable } from "mobx"
import { footerShadow } from "@utils/shadows"
import {
  AnimatedInteractiveInput,
  AnimatedInteractiveInputState,
  booleanToInputState,
  Button,
  DismissKeyboard,
  FormRow,
  Screen,
  Text
} from "@components"
import { Asset } from "@services/asset"
import { Platform } from "@services/device"
import { color, spacing } from "@theme"
import { IValidationRules, validate } from "@utils/validate"
import { equals } from "ramda"
import { isEmpty, merge, snakeCase, transform } from "lodash"
import { ApiRoutes, ITokenResponse } from "@services/api"
import { Injection, InjectionProps } from "@services/injections"
import { HttpRequestError } from "@exceptions"
import { DataLoader } from "@components/data-loader"
import autobind from "autobind-decorator"
import { ApiResponse } from "apisauce"
import { save } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { AppScreens } from "@navigation/navigation-definitions"

export interface ISecondStepRegisterScreenNavigationParams {
  firstName: string,
  lastName: string
  nickName?: string,
}

type ISecondStepRegisterScreen = NavigationScreenProps<ISecondStepRegisterScreenNavigationParams> & InjectionProps

const EXOSUITE: ImageStyle = {
  width: 200,
  height: 100
}

const TITLE: ViewStyle = {
  paddingTop: spacing[3],
  backgroundColor: color.background
}

const FOOTER_CONTAINER: ViewStyle = {
  flexDirection: "row",
  alignSelf: "center",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: color.background,
  width: "100%"
}

const ZERO_PADDING: ViewStyle = {
  padding: 0
}

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundDarkerer
}

const CONTAINER: ViewStyle = {
  ...FULL,
  paddingHorizontal: spacing[4],
  flexGrow: 1,
  justifyContent: "space-evenly"
}

const KEYBOARD_ACCESSORY_VIEW: ViewStyle = {
  backgroundColor: color.backgroundDarkerer,
  borderTopWidth: 0,
  ...footerShadow
}

const TRANSPARENT: ViewStyle = {
  backgroundColor: color.transparent
}

const NEXT_STEP_BUTTON: ViewStyle = {
  alignSelf: "flex-end",
  maxWidth: "35%",
  minWidth: "20%",
  margin: spacing[1]
}

const MAIN_CONTAINER: ViewStyle = {
  marginBottom: spacing[4]
}

const disabled = color.palette.lightGrey
const enabled = color.secondary
const hidePassword = "common.password-hide"
const revealPassword = "common.password-reveal"
const RULES: IValidationRules = { email: { email: true } }

/**
 * FirstStepRegisterScreen will handle the first step of the user registration
 */
@inject(Injection.Api, Injection.SoundPlayer)
@observer
export class SecondStepRegisterScreen extends React.Component<ISecondStepRegisterScreen> {

  @observable private email: string = null
  @observable private emailInputState: AnimatedInteractiveInputState
  @observable private isPasswordVisible = false
  @observable private password: string = null
  @observable private passwordConfirmation: string = null
  private passwordConfirmationRef: TextInput
  private passwordInputRef: TextInput

  @autobind
  private focusOnPassword(): void {
    this.passwordInputRef.focus()
  }

  @autobind
  private focusOnPasswordConfirmation(): void {
    this.passwordConfirmationRef.focus()
  }

  @action.bound
  private handleInvalidEmail(error: HttpRequestError): void {
    const { soundPlayer } = this.props
    this.emailInputState = AnimatedInteractiveInputState.ERROR
    DataLoader.Instance.hasErrors(error, soundPlayer.error)
  }

  @action.bound
  private handleValidEmail(): void {
    this.emailInputState = AnimatedInteractiveInputState.SUCCESS
  }

  private manageResponseError(response: HttpRequestError): void {
    const { soundPlayer } = this.props
    DataLoader.Instance.hasErrors(response, soundPlayer.error)
  }

  private passwordConfirmationIsExactPassword(): boolean {
    return equals(this.password, this.passwordConfirmation)
  }

  private readyForSubscribe(): boolean {
    return this.passwordConfirmationIsExactPassword() && !isEmpty(this.password)
      && this.emailInputState === AnimatedInteractiveInputState.SUCCESS
  }

  @autobind
  private async register(): Promise<void> {
    const { api, navigation, soundPlayer } = this.props
    const { email, password, passwordConfirmation } = this
    DataLoader.Instance.toggleIsVisible()

    const data = transform(
      navigation.state.params,
      (resultObject: Object, value: string, key: string) => resultObject[snakeCase(key)] = value
    )

    merge(data, { email, password, password_confirmation: passwordConfirmation })

    const response: HttpRequestError | ApiResponse<any> =
      await api.post(ApiRoutes.AUTH_REGISTER, data, {}, false)
        .catch((error: HttpRequestError): HttpRequestError => error)

    if (response instanceof HttpRequestError) {
      this.manageResponseError(response)

      return
    }

    const loginResponse: HttpRequestError | ApiResponse<ITokenResponse> =
      await api.login(email, password)
        .catch((error: HttpRequestError): HttpRequestError => error)

    if (loginResponse instanceof HttpRequestError) {
      this.manageResponseError(loginResponse)

      return
    }

    await save(loginResponse.data, Server.EXOSUITE_USERS_API)
    await Promise.all([
      api.getOrCreatePersonalTokens(),
      api.getProfile()
    ])

    DataLoader.Instance.success(
      soundPlayer.success,
      async () => {
        navigation.navigate(AppScreens.HOME)
      })
  }

  @action.bound
  private setEmail(email: string): void {
    this.email = email

    if (isEmpty(email)) {
      this.emailInputState = AnimatedInteractiveInputState.ERROR

      return
    }

    if (isEmpty(validate(RULES, { email }))) {
      const { api } = this.props
      this.emailInputState = AnimatedInteractiveInputState.LOADING
      api.post("auth/preflight/email", { email }, {}, false)
        .then(this.handleValidEmail)
        .catch(this.handleInvalidEmail)

    } else {
      this.emailInputState = AnimatedInteractiveInputState.ERROR
    }
  }

  @action.bound
  private setPassword(password: string): void {
    this.password = password
  }

  @action.bound
  private setPasswordConfirmation(passwordConfirmation: string): void {
    this.passwordConfirmation = passwordConfirmation
  }

  @autobind
  private setPasswordConfirmationInputRef(ref: TextInput): void {
    this.passwordConfirmationRef = ref
  }

  @autobind
  private setPasswordInputRef(ref: TextInput): void {
    this.passwordInputRef = ref
  }

  @action.bound
  private toggleIsPasswordVisible(): void {
    this.isPasswordVisible = !this.isPasswordVisible
  }

  public render(): React.ReactNode {
    const { isPasswordVisible, toggleIsPasswordVisible, emailInputState } = this

    let buttonColor
    this.readyForSubscribe() ? buttonColor = enabled : buttonColor = disabled

    const passwordToggleText = isPasswordVisible ? hidePassword : revealPassword
    const passwordInputState = booleanToInputState(!isEmpty(this.password))
    const passwordConfirmationInputState: AnimatedInteractiveInputState =
      booleanToInputState(this.passwordConfirmationIsExactPassword())

    return (
      <DismissKeyboard>
        <SafeAreaView style={FULL}>
          <FormRow preset="clear" style={TITLE}>
            <Text tx="auth.register.header" preset="registerHeaderCentered" allowFontScaling/>
          </FormRow>

          <Screen style={CONTAINER} backgroundColor={color.background} preset="fixed">
            <FormRow preset={"clearFullWidth"} style={MAIN_CONTAINER}>

              <AnimatedInteractiveInput
                preset="auth"
                autoCapitalize="none"
                placeholderTx="common.username"
                inputStyle={TRANSPARENT}
                withBottomBorder
                autoCorrect={false}
                placeholderTextColor={color.palette.lightGrey}
                onChangeText={this.setEmail}
                inputState={emailInputState}
                returnKeyType="next"
                onSubmitEditing={this.focusOnPassword}
                autoFocus
              />

              <AnimatedInteractiveInput
                preset="auth"
                autoCapitalize="none"
                placeholderTx="common.password"
                inputStyle={TRANSPARENT}
                withBottomBorder
                autoCorrect={false}
                secureTextEntry={!isPasswordVisible}
                placeholderTextColor={color.palette.lightGrey}
                onChangeText={this.setPassword}
                forwardedRef={this.setPasswordInputRef}
                returnKeyType="next"
                onSubmitEditing={this.focusOnPasswordConfirmation}
                inputState={passwordInputState}
              />

              <FormRow preset={"clear"} style={[ZERO_PADDING, { paddingTop: spacing[2] }]}>
                <Button preset="link" tx={passwordToggleText} onPress={toggleIsPasswordVisible}/>
              </FormRow>

              <AnimatedInteractiveInput
                preset="auth"
                autoCapitalize="none"
                placeholderTx="common.password-confirmation"
                inputStyle={TRANSPARENT}
                withBottomBorder
                autoCorrect={false}
                secureTextEntry={!isPasswordVisible}
                placeholderTextColor={color.palette.lightGrey}
                onChangeText={this.setPasswordConfirmation}
                forwardedRef={this.setPasswordConfirmationInputRef}
                inputState={passwordConfirmationInputState}
              />

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
            <Button
              style={{
                backgroundColor: buttonColor,
                ...NEXT_STEP_BUTTON
              }}
              onPress={this.register}
              disabled={buttonColor !== enabled} // can we press on the button?
              preset="primaryFullWidth"
            >
              <Text preset="bold" tx="auth.register.register"/>
            </Button>
          </KeyboardAccessoryView>

        </SafeAreaView>
      </DismissKeyboard>
    )
  }
}
