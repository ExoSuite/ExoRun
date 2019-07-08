import { getEnv, IStateTreeNode } from "mobx-state-tree"
import { Environment } from "../environment"

/**
 * Adds a environment property to the node for accessing our
 * Environment in strongly typed.
 */
// tslint:disable-next-line: typedef
export const withEnvironment = (self: IStateTreeNode) => ({
  views: {
    get environment(): Environment {
      return getEnv(self)
    },
  },
})
