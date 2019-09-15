import createStackNavigator from "react-navigation-stack/src/navigators/createStackNavigator"

jest.mock("Platform", () => {
  const Platform = jest.requireActual("Platform")
  Platform.OS = "ios"

  return Platform
})

const Mock = {
  createStackNavigator
}

jest.mock("react-navigation-stack", () => ({...Mock}));

export {
  createStackNavigator
}
