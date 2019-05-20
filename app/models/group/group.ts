import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { SocketIoPresenceChannel } from "@services/socket.io/socket.io.presence.channel"

/**
 * Model description here for TypeScript hints.
 */
export const GroupModel = types
  .model("Group")
  .props({
    created_at: types.string,
    updated_at: types.string,
    id: types.string,
    name: types.string,
    channel: types.frozen(SocketIoPresenceChannel)
  })
  .views(self => ({

  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({

  })) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type GroupType = Instance<typeof GroupModel>
export interface Group extends GroupType {}
type GroupSnapshotType = SnapshotOut<typeof GroupModel>
export interface GroupSnapshot extends GroupSnapshotType {}
