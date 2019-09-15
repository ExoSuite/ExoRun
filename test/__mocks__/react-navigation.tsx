// tslint:disable

import { SplashScreen } from "@screens/auth"
import {
  ThemeContext,
  ThemeColors,
  withOrientation,
  StackRouter,
  createNavigator,
  createKeyboardAwareNavigator, TabRouter, SwitchRouter
} from "react-navigation"
import { Animated } from "react-native"
import View = Animated.View
import React from "react"

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
    init: () => 0
  },
  getNavigation: (): {} => ({}),
  withNavigation: (props: any) => <View>{props.children}</View>,
  createAppContainer: () => ContainerMock,
  withOrientation: withOrientation,
  createSwitchNavigator: (props: any) => <View>{props.children}</View>,
  ThemeColors,
  ThemeContext,
  StackRouter,
  createNavigator,
  createKeyboardAwareNavigator,
  TabRouter,
  SwitchRouter
}))



