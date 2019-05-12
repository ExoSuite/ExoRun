import React from "react"
import { addDecorator, configure, getStorybookUI } from "@storybook/react-native"
import Config from "react-native-config"
import SplashScreen from "react-native-splash-screen"
import { Provider } from "mobx-react/native"
import { Api } from "@services/api"

// tslint:disable prefer-function-over-method prefer-conditional-expression

const api = new Api()

addDecorator((fn: Function) => {
  return <Provider api={api}>{fn()}</Provider>
})

configure(() => {
  require("./storybook-registry")
}, module)

let StorybookUI
if (Config.SERVER_IP) {
  StorybookUI = getStorybookUI({ port: 9001, host: Config.SERVER_IP, onDeviceUI: true })
} else {
  StorybookUI = getStorybookUI({ port: 9001, host: "localhost", onDeviceUI: true })
}

// RN hot module must be in a class for HMR
/**
 * StorybookUIRoot will handle splashscreen and will display the StorybookUI
 */
export class StorybookUIRoot extends React.Component {
  public async componentDidMount(): Promise<void> {
    SplashScreen.hide()
    // tslint:disable-next-line
    if (typeof __TEST__ === "undefined" || !__TEST__) {
      const Reactotron = require("../app/services/reactotron")
      const reactotron = new Reactotron.Reactotron()
      await reactotron.setup()
    }
  }

  public render(): React.ReactNode {
    return <StorybookUI />
  }
}
