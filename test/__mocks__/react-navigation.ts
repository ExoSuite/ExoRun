// tslint:disable

import { SplashScreen } from "@screens/auth"

class ContainerMock extends SplashScreen {
  public static router = {
    getStateForAction: jest.fn()
  }
  static defaultProps: { imageProperties: { height: number; width: number; }; }
}

ContainerMock.defaultProps = {
  imageProperties: {
    height: 100,
    width: 100
  }
}

jest.mock("react-navigation", () => ({
  NavigationActions: {
    init: () => 0,
  },
  getNavigation: (): {} => ({}),
  withNavigation: jest.fn(),
  createAppContainer: () => ContainerMock,
  withOrientation: jest.fn(),
  createStackNavigator: jest.fn(),
  createSwitchNavigator: jest.fn()
}))

