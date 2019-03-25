// we always make sure 'react-native' gets included first
import "react-native"
import "./__mocks__/react-native-localize"
import "./__mocks__/react-native-keychain"
import "./__mocks__/textinput"

declare global {
  let __TEST__
}
