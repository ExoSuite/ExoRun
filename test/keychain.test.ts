/*
import { load, save } from "src/lib/keychain";
import * as ReactNativeKeychain from "react-native-keychain";

const credentials = {
  token_type: "bearer",
  expires_in: 200,
  access_token: "iejaziojeoizajeza",
  refresh_token: "lapoazkeokapekza"
};

jest.mock("react-native-keychain", () => {
  return {
    setInternetCredentials: jest.fn(
      (server, username, password) => new Promise((resolve, reject) => resolve(true))
    ),
    getInternetCredentials: jest.fn((server) => new Promise((resolve, reject) => resolve(true))),
  };
});

const server = 'test';


test("save", async () => {

  return save(credentials, server).then(() => {
    expect(ReactNativeKeychain.setInternetCredentials).toHaveBeenCalledWith(credentials, server);
  });
});

test("load", async () => {
  const creds = await load("test");
  console.log(creds);
  // expect(value).toEqual(JSON.parse(VALUE_STRING));
});
*/

test('ok', () => {});
