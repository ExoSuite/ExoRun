import { types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const LoaderModel = types
  .model("Loader")
  .props({})
  .views(self => ({}))
  .actions(self => ({}))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .actions(self => ({
 *   postProcessSnapshot: omit(["password", "socialSecurityNumber", "creditCardNumber"]),
 * }))
 */

type LoaderType = typeof LoaderModel.Type

export interface Loader extends LoaderType {
}

type LoaderSnapshotType = typeof LoaderModel.SnapshotType

export interface LoaderSnapshot extends LoaderSnapshotType {
}
