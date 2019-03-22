import { Button, DismissKeyboard, Screen, Text } from "@components"
import { FormRow } from "@components/form-row"
import { Asset } from "@services/asset"
import { Platform } from "@services/device"
import { color, spacing } from "@theme"
import { observer } from "mobx-react"
import * as React from "react"
import { Image, ImageStyle, SafeAreaView, View, ViewStyle } from "react-native"
import { KeyboardAccessoryView } from "react-native-keyboard-accessory"
import KeyboardSpacer from "react-native-keyboard-spacer"
import { NavigationScreenProps } from "react-navigation"
import { observable } from "mobx"
import { footerShadow } from "@utils/footer-shadow"
import {
  AnimatedInteractiveInput,
  AnimatedInteractiveInputState,
  booleanToInputState,
  stringToBoolean
} from "@components/animated-interactive-input"
import autobind from "autobind-decorator"

export interface IRegisterScreenProps extends NavigationScreenProps<{}> {
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

const INPUT_STATE = {
  true: AnimatedInteractiveInputState.SUCCESS,
  false: AnimatedInteractiveInputState.ERROR
}

const disabled = color.palette.lightGrey
const enabled = color.secondary

/**
 * FirstStepRegisterScreen will handle the first step of the user registration
 */
@observer
export class FirstStepRegisterScreen extends React.Component<IRegisterScreenProps> {

  @observable private firstName: string
  @observable private lastName: string
  @observable private nickName?: string

  @autobind
  private setFirstName(firstName: string): void {
    this.firstName = firstName
  }

  @autobind
  private setLastName(lastName: string): void {
    this.lastName = lastName
  }

  @autobind
  private setNickName(nickName: string): void {
    this.nickName = nickName
  }

  // tslint:disable-next-line no-feature-envy
  public render(): React.ReactNode {
    const { firstName, lastName, nickName } = this

    let buttonColor
    firstName && lastName ? buttonColor = enabled : buttonColor = disabled

    const firstNameInputState = booleanToInputState(stringToBoolean(firstName))
    const lastNameInputState = booleanToInputState(stringToBoolean(lastName))
    const nickNameInputState = booleanToInputState(stringToBoolean(nickName))

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
                placeholderTx="auth.register.firstName"
                inputStyle={TRANSPARENT}
                withBottomBorder
                placeholderTextColor={color.palette.lightGrey}
                onChangeText={this.setFirstName}
                inputState={firstNameInputState}
              />

              <AnimatedInteractiveInput
                preset="auth"
                autoCapitalize="none"
                placeholderTx="auth.register.lastName"
                inputStyle={TRANSPARENT}
                withBottomBorder
                placeholderTextColor={color.palette.lightGrey}
                onChangeText={this.setLastName}
                inputState={lastNameInputState}
              />

              <AnimatedInteractiveInput
                preset="auth"
                autoCapitalize="none"
                placeholderTx="auth.register.nickName"
                inputStyle={TRANSPARENT}
                withBottomBorder
                placeholderTextColor={color.palette.lightGrey}
                onChangeText={this.setNickName}
                inputState={nickNameInputState}
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
              // onPress={this.authorizeLogin}
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
