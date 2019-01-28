// we always make sure 'react-native' gets included first
import "react-native"

// libraries to mock
import "./mock-i18n"
import "./mock-reactotron"
import "./mock-textinput"
import "./mock-react-native-languages"
import "./mock-react-native-splash-screen"

declare global {
  let __TEST__
}
