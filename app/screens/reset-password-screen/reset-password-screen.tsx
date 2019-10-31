import React from "react"
import { WebView } from "react-native-webview"
import { inject } from "mobx-react/native"
import { Injection, InjectionProps } from "@services/injections"

const source = { uri: "" }

/**
 * Define Reset password behaviour
 */
@inject(Injection.Api)
export class ResetPasswordScreen extends React.Component<InjectionProps> {

  public render(): React.ReactNode {
    const { api } = this.props

    source.uri = `${api.Url}/auth/password/reset/`

    return (
      <WebView source={source}/>
    )
  }
}
