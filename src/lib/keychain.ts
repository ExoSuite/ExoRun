import * as ReactNativeKeychain from "react-native-keychain";
import { TokenResponse } from "src/services/api";

/**
 * Saves some credentials securely.
 *
 * @param tokens
 * @param server The server these creds are for.
 */
export async function save(tokens: TokenResponse, server: string) {
  // TODO: verify if save function save a TokenResponse
  await ReactNativeKeychain.setInternetCredentials(server, "exosuite", JSON.stringify(tokens));
  return true;
}

/**
 * Loads credentials that were already saved.
 *
 * @param server The server that these creds are for
 */
export async function load(server: string) {
  // TODO: verify if load function return a TokenResponse
  const creds = await ReactNativeKeychain.getInternetCredentials(server);
  return {
    tokens: creds.password,
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
