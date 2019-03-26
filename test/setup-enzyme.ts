import "react-native"
import "jest-enzyme"
import ReactSixteenAdapter from "enzyme-adapter-react-16"
import Enzyme from "enzyme"

/**
 * Set up Enzyme to mount to DOM, simulate events,
 * and inspect the DOM in tests.
 */
Enzyme.configure({ adapter: new ReactSixteenAdapter() })

/**
 * Ignore some expected warnings
 * see: https://jestjs.io/docs/en/tutorial-react.html#snapshot-testing-with-mocks-enzyme-and-react-16
 * see https://github.com/Root-App/react-native-mock-render/issues/6
 */
const originalConsoleError = console.error
console.error = (message: string): void => {
  if (message.startsWith("Warning:")) {
    return
  }

  originalConsoleError(message)
}

const originalConsoleWarn = console.warn
console.warn = (message: string): void => {
  if (
    message.startsWith("node_modules/react-native/Libraries/Animated/src/NativeAnimatedHelper.js") ||
    message.startsWith("Animated: `useNativeDriver`")
  ) {
    return
  }

  originalConsoleWarn(message)
}
