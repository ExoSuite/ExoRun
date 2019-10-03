import { Instance, SnapshotOut, types } from "mobx-state-tree"

const UserMessageModel = types.model("UserMessageModel").props({
  id: types.string,
  first_name: types.maybeNull(types.string),
  last_name: types.maybeNull(types.string),
  nick_name: types.maybeNull(types.string)
})

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
    updated_at: types.string,
    user: types.frozen(UserMessageModel)
  })
  .views((self: Instance<typeof MessageModel>) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self: Instance<typeof MessageModel>) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

type MessageType = Instance<typeof MessageModel>

// tslint:disable-next-line:no-empty-interface
export interface IMessageModel extends MessageType {
}

type MessageSnapshotType = SnapshotOut<typeof MessageModel>

// tslint:disable-next-line:interface-name no-empty-interface
export interface MessageSnapshot extends MessageSnapshotType {
}
