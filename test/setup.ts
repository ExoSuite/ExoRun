// we always make sure 'react-native' gets included first
import "react-native"

// libraries to mock
import "./mocks/mock-i18n"
import "./mocks/mock-reactotron"
import "./mocks/mock-textinput"
import "./mocks/mock-react-native-languages"
import "./mocks/mock-react-native-splash-screen"

declare global {
  let __TEST__
}
