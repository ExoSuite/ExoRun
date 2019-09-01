import { reset } from "@utils/keychain"

export enum Server {
  EXOSUITE_USERS_API = "exosuite-users-api",
  EXOSUITE_USERS_API_PERSONAL = "exosuite-users-api-personal",
}

export async function ServerReset(): Promise<void> {
  await Promise.all(Object.keys(Server).map(async (key: string) => reset(Server[key])))
}
