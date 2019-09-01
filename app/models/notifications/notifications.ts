import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { INotificationModel, NotificationModel } from "@models/notification"

/**
 * Model description here for TypeScript hints.
 */
export const NotificationsModel = types
  .model("Notifications")
  .props({
    notifications: types.optional(types.array(NotificationModel), []),
  })
  .views((self: INotificationsModel) => ({
    get sortedNotifications(): INotificationModel[] {
      return self.notifications
    }
  }))
  .actions((self: INotificationsModel)  => ({
    createNotification(notification: any): void {
      self.notifications.unshift(NotificationModel.create(notification))
    }
  }))

// tslint:disable-next-line:no-empty-interface
export interface INotificationsModel extends Instance<typeof NotificationsModel> {}
type NotificationsSnapshotType = SnapshotOut<typeof NotificationsModel>
// tslint:disable-next-line: no-empty-interface
export interface INotificationsSnapshot extends NotificationsSnapshotType {}
