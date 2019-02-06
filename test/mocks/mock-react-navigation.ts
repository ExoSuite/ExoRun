jest.mock("react-navigation", () => {
  return {
    NavigationActions: {
      init: () => {
      }
    },
    withOrientation: () => {
    },
    createStackNavigator: () => {
    },
    createSwitchNavigator: () => {
      return {
        router: {
          getStateForAction: () => {
          }
        }
      }
    }
  }
})
