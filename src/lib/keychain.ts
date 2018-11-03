import * as ReactNativeKeychain from "react-native-keychain";

/**
 * Saves some credentials securely.
 *
 * @param token
 * @param server The server these creds are for.
 */
export async function save(token: string, server: string) {
  await ReactNativeKeychain.setInternetCredentials(server, null, token);
  return true;
}

/**
 * Loads credentials that were already saved.
 *
 * @param server The server that these creds are for
 */
export async function load(server: string) {
  const creds = await ReactNativeKeychain.getInternetCredentials(server);
  return {
    token: creds.password,
    server,
  };
}

/**
 * Resets any existing credentials for the given server.
 *
 * @param server The server which has these creds
 */
export async function reset(server: string) {
  await ReactNativeKeychain.resetInternetCredentials(server);
  return true;
}
