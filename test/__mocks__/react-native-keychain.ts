// tslint:disable

jest.mock("react-native-keychain", () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  getInternetCredentials: () => {
    return {
      "connect-io-exorun": {
        accessToken: "eazrztyh"
      },
      "group-exorun": {
        accessToken: "eazrztyh"
      },
      "message-exorun": {
        accessToken: "eazrztyh"
      },
      "view-picture-exorun": {
        accessToken: "eazrztyh"
      },
    }
  }
}))
