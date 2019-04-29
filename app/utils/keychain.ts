import { IPersonalTokens, ITokenResponse } from "@services/api"
import { Server } from "@services/api/api.servers"
import * as ReactNativeKeychain from "react-native-keychain"

/**
 * Saves some credentials securely.
 *
 * @param tokens
 * @param server The server these creds are for.
 */
export async function save(tokens: ITokenResponse | IPersonalTokens, server: Server): Promise<boolean> {
  await ReactNativeKeychain.setInternetCredentials(
    server,
    "ExoRun",
    JSON.stringify(tokens)
  )

  return true
}

/**
 * Loads credentials that were already saved.
 *
 * @param server The server that these creds are for
 */
export async function load(server: Server): Promise<ITokenResponse | IPersonalTokens | boolean> {
  const creds = await ReactNativeKeychain.getInternetCredentials(server)
  if (creds.password) {
    return JSON.parse(creds.password)
  }

  return false
}

/**
 * Resets any existing credentials for the given server.
 *
 * @param server The server which has these creds
 */
export async function reset(server: Server): Promise<boolean> {
  await ReactNativeKeychain.resetInternetCredentials(server)

  return true
}
