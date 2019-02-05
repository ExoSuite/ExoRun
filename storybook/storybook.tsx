import React from "react"
import { getStorybookUI, configure } from "@storybook/react-native"
import SplashScreen from "react-native-splash-screen"
import { Provider } from "mobx-react/native"
import Config from "react-native-config"

configure(() => {
  require("./storybook-registry")
})

let StorybookUI;
if (Config.SERVER_IP) {
  StorybookUI = getStorybookUI({ port: 9001, host: Config.SERVER_IP, onDeviceUI: true })
}
else {
  StorybookUI = getStorybookUI({ port: 9001, host: "localhost", onDeviceUI: true })
}

// RN hot module must be in a class for HMR
export class StorybookUIRoot extends React.Component {
  componentDidMount() {
    SplashScreen.hide()
    if (typeof __TEST__ === "undefined" || !__TEST__) {
      const Reactotron = require("../app/services/reactotron")
      const reactotron = new Reactotron.Reactotron()
      reactotron.setup()
    }
  }

  render() {
    return (
      <Provider store={{}}>
        <StorybookUI />
      </Provider>
    )

  }
}
