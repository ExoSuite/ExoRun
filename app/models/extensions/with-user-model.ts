import { getEnv, IStateTreeNode } from "mobx-state-tree"
import { IUserModel } from "@models/user-profile"

/**
 * Adds a environment property to the node for accessing our
 * Environment in strongly typed.
 */
// tslint:disable-next-line: typedef
export const withUserModel = (self: IStateTreeNode) => ({
  views: {
    get userModel(): IUserModel {
      return getEnv(self).userModel
    }
  }
})
