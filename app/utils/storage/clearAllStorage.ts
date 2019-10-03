import { reset } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { clear } from "@utils/storage/storage"

export async function clearAllStorage(): Promise<void> {
  await Promise.all([
    reset(Server.EXOSUITE_USERS_API_PERSONAL),
    reset(Server.EXOSUITE_USERS_API),
    clear()
  ])
}
