// we always make sure 'react-native' gets included first
import "react-native"
import "./__mocks__/react-native-localize"
import "./__mocks__/react-native-keychain"
import "./__mocks__/textinput"
import "./__mocks__/react-navigation"
import "./__mocks__/react-native-splash-screen"
import "./__mocks__/mock-setup-root-store"

import { WebSocket } from "mock-socket"

// @ts-ignore
global.WebSocket = WebSocket
jest.useFakeTimers()

declare global {
  let __TEST__
}
