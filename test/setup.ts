// we always make sure 'react-native' gets included first
import "react-native"
// libraries to mock
import "./mocks/mock-react-native-gesture-handler"
import "./mocks/mock-i18n"
import "./mocks/mock-reactotron"
import "./mocks/mock-textinput"
import "./mocks/mock-react-native-localize"
import "./mocks/mock-react-native-splash-screen"
import "./mocks/mock-react-navigation"
import "./mocks/mock-react-native-sound"

declare global {
  let __TEST__
}
