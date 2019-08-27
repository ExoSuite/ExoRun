import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { NotificationModel } from "@models/notification"

/**
 * Model description here for TypeScript hints.
 */
export const NotificationsModel = types
  .model("Notifications")
  .props({
    notifications: types.optional(types.array(NotificationModel), []),
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self: INotifications)  => ({
    createNotification(notification: any): void {
      self.notifications.unshift(NotificationModel.create(notification))
    }
  }))

// tslint:disable-next-line:no-empty-interface
export interface INotifications extends Instance<typeof NotificationsModel> {}
type NotificationsSnapshotType = SnapshotOut<typeof NotificationsModel>
export interface NotificationsSnapshot extends NotificationsSnapshotType {}
