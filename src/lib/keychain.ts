import * as ReactNativeKeychain from "react-native-keychain";
import { ITokenResponse } from "src/services/api";

/**
 * Saves some credentials securely.
 *
 * @param tokens
 * @param server The server these creds are for.
 */
export async function save(tokens: ITokenResponse, server: string): Promise<boolean> {
  await ReactNativeKeychain.setInternetCredentials(server, 'ExoRun', JSON.stringify(tokens));
  return true;
}

/**
 * Loads credentials that were already saved.
 *
 * @param server The server that these creds are for
 */
export async function load(server: string): Promise<ITokenResponse | boolean> {
  const creds = await ReactNativeKeychain.getInternetCredentials(server);
  if (creds.password)
    return JSON.parse(creds.password);
  return false;
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
