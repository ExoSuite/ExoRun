import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const NotificationModel = types
  .model("Notification")
  .props({})
  .views((self: INotificationModel) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self: INotificationModel) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface INotificationModel extends Instance<typeof NotificationModel> {}
type NotificationSnapshotType = SnapshotOut<typeof NotificationModel>
export interface INotificationSnapshot extends NotificationSnapshotType {}
