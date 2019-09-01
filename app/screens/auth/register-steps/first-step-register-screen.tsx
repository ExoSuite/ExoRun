import * as React from "react"
import { Image, ImageStyle, SafeAreaView, TextInput, View, ViewStyle } from "react-native"
import { observer } from "mobx-react"
import { KeyboardAccessoryView } from "react-native-keyboard-accessory"
import { isEmpty, pickBy } from "lodash"
import { NavigationScreenProps } from "react-navigation"
import { action, observable } from "mobx"
import { footerShadow } from "@utils/shadows"
import {
  AnimatedInteractiveInput,
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
import autobind from "autobind-decorator"
import { RegisterScreens } from "@navigation/navigation-definitions"

interface IFirstStepRegisterScreenProps extends NavigationScreenProps<{}> {
}

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

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundDarkerer
}

const CONTAINER: ViewStyle = {
  ...FULL,
  paddingHorizontal: spacing[4],
  flex: 1,
  justifyContent: Platform.Android ? "space-evenly" : "flex-start",
  backgroundColor: color.background
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

const disabled = color.palette.lightGrey
const enabled = color.secondary

/**
 * FirstStepRegisterScreen will handle the first step of the user registration
 */
@observer
export class FirstStepRegisterScreen extends React.Component<IFirstStepRegisterScreenProps> {
  @observable private firstName: string = null
  @observable private lastName: string = null

  private lastNameInputRef: TextInput
  @observable private nickName?: string = null
  private nickNameInputRef: TextInput

  @autobind
  private focusOnLastName(): void {
    this.lastNameInputRef.focus()
  }

  @autobind
  private focusOnNickName(): void {
    this.nickNameInputRef.focus()
  }

  @autobind
  private goToSecondStep(): void {
    const { navigation } = this.props
    const { nickName, lastName, firstName } = this
    navigation.navigate(RegisterScreens.SECOND, pickBy({ nickName, lastName, firstName }))
  }

  @autobind
  private onNickNameSubmit(): void {
    this.nickNameInputRef.blur()
    this.goToSecondStep()
  }

  @action.bound
  private setFirstName(firstName: string): void {
    this.firstName = firstName
  }

  @action.bound
  private setLastName(lastName: string): void {
    this.lastName = lastName
  }

  @autobind
  private setLastNameInputRef(ref: TextInput): void {
    this.lastNameInputRef = ref
  }

  @action.bound
  private setNickName(nickName: string): void {
    this.nickName = nickName
  }

  @autobind
  private setNickNameInputRef(ref: TextInput): void {
    this.nickNameInputRef = ref
  }

  // tslint:disable-next-line no-feature-envy
  public render(): React.ReactNode {
    const { firstName, lastName, nickName, goToSecondStep } = this

    let buttonColor
    firstName && lastName ? buttonColor = enabled : buttonColor = disabled

    const firstNameInputState = booleanToInputState(!isEmpty(firstName))
    const lastNameInputState = booleanToInputState(!isEmpty(lastName))
    const nickNameInputState = booleanToInputState(!isEmpty(nickName))

    return (
      <DismissKeyboard>
        <SafeAreaView style={FULL}>
          <FormRow preset="clear" style={TITLE}>
            <Text tx="auth.register.header" preset="registerHeaderCentered" allowFontScaling/>
          </FormRow>

          <Screen style={CONTAINER} backgroundColor={color.background} preset="fixed">
            <FormRow preset="clearFullWidth">
              <AnimatedInteractiveInput
                preset="auth"
                autoCapitalize="none"
                placeholderTx="auth.register.firstName"
                inputStyle={TRANSPARENT}
                withBottomBorder
                autoCorrect={false}
                placeholderTextColor={color.palette.lightGrey}
                onChangeText={this.setFirstName}
                inputState={firstNameInputState}
                returnKeyType="next"
                onSubmitEditing={this.focusOnLastName}
                autoFocus
              />
            </FormRow>
            <FormRow preset="clearFullWidth">
              <AnimatedInteractiveInput
                preset="auth"
                autoCapitalize="none"
                placeholderTx="auth.register.lastName"
                inputStyle={TRANSPARENT}
                withBottomBorder
                autoCorrect={false}
                placeholderTextColor={color.palette.lightGrey}
                onChangeText={this.setLastName}
                inputState={lastNameInputState}
                forwardedRef={this.setLastNameInputRef}
                returnKeyType="next"
                onSubmitEditing={this.focusOnNickName}
              />
            </FormRow>
            <FormRow preset="clearFullWidth">
              <AnimatedInteractiveInput
                preset="auth"
                autoCapitalize="none"
                placeholderTx="auth.register.nickName"
                inputStyle={TRANSPARENT}
                withBottomBorder
                autoCorrect={false}
                placeholderTextColor={color.palette.lightGrey}
                onChangeText={this.setNickName}
                inputState={nickNameInputState}
                forwardedRef={this.setNickNameInputRef}
                returnKeyType="next"
                onSubmitEditing={this.onNickNameSubmit}
              />
            </FormRow>
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
              onPress={goToSecondStep}
              disabled={buttonColor !== enabled} // can we press on the login button?
              preset="primaryFullWidth"
            >
              <Text preset="bold" tx="common.next"/>
            </Button>
          </KeyboardAccessoryView>

        </SafeAreaView>
      </DismissKeyboard>
    )
  }
}
