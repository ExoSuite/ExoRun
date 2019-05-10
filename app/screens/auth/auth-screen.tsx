import { Button, Screen, Text } from "@components"
import { Asset } from "@services/asset"
import { color, spacing } from "@theme"
import autobind from "autobind-decorator"
import { observer } from "mobx-react"
import * as React from "react"
import { Image, ImageStyle, SafeAreaView, View, ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { AuthScreens } from "@navigation/navigation-definitions"

export interface IAuthScreenProps extends NavigationScreenProps<{}> {
}

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.background
}

const CONTAINER: ViewStyle = {
  ...FULL,
  paddingHorizontal: spacing[4]
}

const EXORUN_TEXT: ImageStyle = {
  width: 150,
  height: 50,
  marginTop: spacing[3],
  alignSelf: "center"
}

const EXORUN_LOGO: ImageStyle = {
  width: 75,
  height: 35,
  alignSelf: "center"
}

const EXOSUITE: ImageStyle = {
  width: 200,
  height: 100
}

const FOOTER_CONTAINER: ViewStyle = {
  flexDirection: "row",
  alignSelf: "center",
  alignItems: "center",
  justifyContent: "center"
}

const exorunTextAsset = Asset.Locator("exorun-text")
const exorunLogoAsset = Asset.Locator("exorun-logo")
const exosuiteLogoAsset = Asset.Locator("exosuite-logo")

const largeHeaderCenteredContainer: ViewStyle = {
  marginBottom: 100
}

const BUTTON: ViewStyle = {
  width: "80%"
}

const navigateToLoginContainer: ViewStyle = {
  ...BUTTON,
  marginBottom: 10
}

const navigateToRegisterContainer: ViewStyle = {
  ...BUTTON
}

/**
 * AuthScreen component Is used to show login and register buttons
 */
@observer
export class AuthScreen extends React.Component<IAuthScreenProps> {

  @autobind
  public navigateToLogin(): void {
    const { navigation } = this.props
    navigation.navigate(AuthScreens.LOGIN)
  }

  @autobind
  public navigateToRegister(): void {
    const { navigation } = this.props
    navigation.navigate(AuthScreens.REGISTER)
  }

  public render(): React.ReactNode {
    const { navigateToRegister, navigateToLogin } = this

    return (
      <SafeAreaView style={FULL}>
        <Image
          source={exorunTextAsset}
          style={EXORUN_TEXT}
          resizeMode="contain"
        />
        <Image
          source={exorunLogoAsset}
          style={EXORUN_LOGO}
          resizeMode="contain"
        />
        <Screen style={CONTAINER} backgroundColor={color.transparent} preset="fixedCenter">
          <View style={largeHeaderCenteredContainer}>
            <Text preset="largeHeaderCentered" tx="auth.slogan"/>
          </View>
          <Button style={navigateToLoginContainer} onPress={navigateToLogin}>
            <Text preset="bold" tx="auth.login.header"/>
          </Button>
          <Button style={navigateToRegisterContainer} onPress={navigateToRegister} preset="secondary">
            <Text preset="bold" tx="auth.register.register"/>
          </Button>
        </Screen>
        <View style={FOOTER_CONTAINER}>
          <Text preset="bold" tx="auth.powered"/>
          <Image
            source={exosuiteLogoAsset}
            style={EXOSUITE}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    )
  }
}
