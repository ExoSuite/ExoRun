import * as React from "react"
import { SafeAreaView, TextStyle, View, ViewStyle, Image, ImageStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { observer } from "mobx-react"
import throttle from "lodash.throttle"
import KeyboardSpacer from "react-native-keyboard-spacer"
import { Button, DismissKeyboard, Header, PressableText, Screen, Text, TextField } from "@components"
import { color, spacing } from "@theme"
import { FormRow } from "@components/form-row"
import { Platform } from "@services/device"
import { Asset } from "@services/asset"
import { palette } from "@theme/palette"
import { KeyboardAccessoryView } from "react-native-keyboard-accessory"

export interface RegisterScreenProps extends NavigationScreenProps<{}> {
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

@observer
export class RegisterScreen extends React.Component<RegisterScreenProps, {}> {

  private readonly goBack: Function

  constructor(props) {
    super(props)
    this.goBack = throttle(props.navigation.goBack, 3000)
  }

  back() {
    this.goBack()
  }

  render() {

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
                onChangeText={() => {}}
              />

              <TextField
                preset={"loginScreen"}
                placeholderTx="auth.login.password"
                inputStyle={{ backgroundColor: "transparent" }}
                placeholderTextColor={color.palette.lightGrey}
                onChangeText={() => {}}
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
            animateOn="all"
            alwaysVisible
            style={KEYBOARD_ACCESSORY_VIEW}
            inSafeAreaView
            androidAdjustResize
          >
            <Button
              style={{ backgroundColor: "grey", width: "20%", alignSelf: "flex-end", paddingRight: spacing[1] }}
              onPress={() => {}}
              disabled={false} // can we press on the login button?
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
