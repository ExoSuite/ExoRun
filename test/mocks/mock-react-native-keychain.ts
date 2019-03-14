jest.mock("react-native-keychain", () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  getInternetCredentials: () => {
    return {
      password: "",
    }
  },
}))
