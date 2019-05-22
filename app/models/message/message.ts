import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const MessageModel = types
  .model("Message")
  .props({
    contents: types.string,
    group_id: types.string,
    id: types.string,
    user_id: types.string,
    created_at: types.string,
    updated_at: types.string
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type MessageType = Instance<typeof MessageModel>
export interface IMessageModel extends MessageType {}
type MessageSnapshotType = SnapshotOut<typeof MessageModel>
export interface MessageSnapshot extends MessageSnapshotType {}
