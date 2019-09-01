import { getRoot, IStateTreeNode } from "mobx-state-tree"
import { RootStore } from "../root-store"

/**
 * Adds a rootStore property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
// tslint:disable-next-line: typedef
export const withRootStore = (self: IStateTreeNode) => ({
  views: {
    get rootStore(): RootStore {
      return getRoot(self)
    }
  }
})
