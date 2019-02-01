import { clear } from "@utils/storage"
import { RootStore } from "@models/root-store"

export type GetRootStore = () => RootStore;

export const commandMiddleware = (getRootStore: GetRootStore) => {
  return tron => {
    return {
      onCommand: async command => {
        if (command.type !== "custom") return
        switch (command.payload) {
          case "resetStore":
            console.tron.log("resetting store")
            await clear()
            break
          case "resetNavigation":
            console.tron.log("resetting navigation store")
            getRootStore().navigationStore.reset()
            break
        }
      }
    }
  }
}
