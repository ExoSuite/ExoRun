import { Button, Screen, Text } from "@components"
import { Asset } from "@services/asset"
import { color, spacing } from "@theme"
import autobind from "autobind-decorator"
import { observer } from "mobx-react"
import * as React from "react"
import { Image, ImageStyle, SafeAreaView, View, ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"

export interface IAuthScreenProps extends NavigationScreenProps<{}> {
}

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.background,
}

const CONTAINER: ViewStyle = {
  ...FULL,
  paddingHorizontal: spacing[4],
}

const EXORUN_TEXT: ImageStyle = {
  width: 150,
  height: 50,
  alignSelf: "center",
}

const EXORUN_LOGO: ImageStyle = {
  width: 75,
  height: 35,
  alignSelf: "center",
}

const EXOSUITE: ImageStyle = {
  width: 200,
  height: 100,
}

const FOOTER_CONTAINER: ViewStyle = {
  flexDirection: "row",
  alignSelf: "center",
  alignItems: "center",
  justifyContent: "center",
}

const exorunTextAsset = Asset.Locator("exorun-text")
const exorunLogoAsset = Asset.Locator("exorun-logo")
const exosuiteLogoAsset = Asset.Locator("exosuite-logo")

/**
 * AuthScreen component is used to show login and register buttons
 */
@observer
export class AuthScreen extends React.Component<IAuthScreenProps> {

  @autobind
  public navigateToLogin(): void {
    const { navigation } = this.props
    navigation.navigate("login")
  }

  @autobind
  public navigateToRegister(): void {
    const { navigation } = this.props
    navigation.navigate("register")
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
          <View style={{ marginBottom: 100 }}>
            <Text preset="largeHeaderCentered" tx="auth.slogan"/>
          </View>
          <Button style={{ width: "80%", marginBottom: 10 }} onPress={navigateToLogin}>
            <Text preset="bold" tx="auth.login.header"/>
          </Button>
          <Button style={{ width: "80%" }} onPress={navigateToRegister} preset="secondary">
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
