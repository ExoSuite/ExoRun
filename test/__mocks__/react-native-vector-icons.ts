
jest.mock("react-native-vector-icons/FontAwesome5Pro", () => {
  const mockComponent = require("mockComponent").default;
  const module1 = jest.genMockFromModule("react-native-vector-icons/FontAwesome5Pro");
  const Icon = mockComponent("Icon");
  Icon.Button = mockComponent("Icon.Button");
  // @ts-ignore
  module1.default = Icon;
  // @ts-ignore
  module1.Button = Icon.Button;

  return module1;
});
