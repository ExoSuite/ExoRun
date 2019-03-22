import { NavigationStoreModel } from "@navigation/navigation-store"
import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * An RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  navigationStore: types.optional(NavigationStoreModel, {}),
})

/**
 * The RootStore Instance.
 */
export type RootStore = Instance<typeof RootStoreModel>

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>
