import { Button, DismissKeyboard, Screen, Text, TextField } from "@components"
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

export interface IRegisterScreenProps extends NavigationScreenProps<{}> {
}

const EXOSUITE: ImageStyle = {
  width: 200,
  height: 100,
}

const EXTRA_PADDING_TOP: ViewStyle = {
  paddingTop: spacing[3],
}

const FOOTER_CONTAINER: ViewStyle = {
  flexDirection: "row",
  alignSelf: "center",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: color.background,
  width: "100%",
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
  borderTopWidth: 0,
  ...footerShadow
}



/**
 * RegisterScreen will handle the register of an user
 * by calling /auth/register
 */
@observer
export class RegisterScreen extends React.Component<IRegisterScreenProps> {

  @observable private canGoNextStep: boolean;

  // tslint:disable-next-line no-feature-envy
  public render(): React.ReactNode {

    return (
      <DismissKeyboard>
        <SafeAreaView style={FULL}>
          <FormRow preset={"clear"} style={[EXTRA_PADDING_TOP, { backgroundColor: color.background }]}>
            <Text tx="auth.register.header" preset="registerHeaderCentered" allowFontScaling/>
          </FormRow>

          <Screen style={CONTAINER} backgroundColor={color.background} preset="fixed">
            <FormRow preset={"clearFullWidth"} style={{ marginBottom: spacing[4] }}>
              <TextField
                preset={"loginScreen"}
                autoCapitalize={"none"}
                placeholderTx="auth.login.username"
                inputStyle={{ backgroundColor: "transparent" }}
                placeholderTextColor={color.palette.lightGrey}
                // onChangeText={() => {}}
              />

              <TextField
                preset={"loginScreen"}
                placeholderTx="auth.login.password"
                inputStyle={{ backgroundColor: "transparent" }}
                placeholderTextColor={color.palette.lightGrey}
                //  onChangeText={() => {}}
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
              style={{ backgroundColor: 'blue', alignSelf: "flex-end", maxWidth: "35%", minWidth: "20%",
                margin: spacing[1], minHeight: 45 }}
              // onPress={this.authorizeLogin}
              // disabled={buttonColor !== enabled} // can we press on the login button?
              preset="primaryFullWidth"
            >
              <Text preset="bold" tx="auth.login.header"/>
            </Button>
          </KeyboardAccessoryView>

        </SafeAreaView>
      </DismissKeyboard>
    )
  }
}
