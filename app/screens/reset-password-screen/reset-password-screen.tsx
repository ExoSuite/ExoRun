import React from "react"
import { WebView } from "react-native-webview"
import { inject } from "mobx-react/native"
import { Injection, InjectionProps } from "@services/injections"
import { SafeAreaView, TextStyle, ViewStyle } from "react-native"
import { Header } from "@components/header"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import autobind from "autobind-decorator"
import { NavigationStackScreenProps } from "react-navigation-stack"

const source = { uri: "" }

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundDarkerer
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

/**
 * Define Reset password behaviour
 */
@inject(Injection.Api)
export class ResetPasswordScreen extends React.Component<InjectionProps & NavigationStackScreenProps> {

  private readonly source: typeof source

  constructor(props: InjectionProps & NavigationStackScreenProps) {
    super(props)
    this.source = { uri: `${props.api.Url}/auth/password/reset/` }
  }

  @autobind
  private goBack(): void {
    this.props.navigation.goBack()
  }

  public render(): React.ReactNode {
    return (
      <SafeAreaView style={FULL}>
        <Header
          leftIcon="chevron-left"
          leftIconType="solid"
          leftIconSize={20}
          leftIconColor={color.palette.lightBlue}
          onLeftPress={this.goBack}
          style={HEADER}
          titleStyle={HEADER_TITLE}
        />
        <WebView
          source={this.source}
        />
      </SafeAreaView>
    )
  }
}
