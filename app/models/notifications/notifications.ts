import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { INotificationModel, NotificationModel } from "@models/notification"
import { withEnvironment } from "@models/extensions"
import { ApiRoutes, ILiveNotification, INotification, INotificationApiResponse } from "@services/api"
import { ApiOkResponse } from "apisauce"
import { isEmpty, noop, orderBy } from "lodash-es"
import { IGroup } from "@models/group"

/**
 * Model description here for TypeScript hints.
 */
export const NotificationsModel = types
  .model("Notifications")
  .extend(withEnvironment)
  .props({
    currentPage: types.optional(types.number, 0),
    maxPage: types.optional(types.number, 0),
    notifications: types.optional(types.array(NotificationModel), []),
  })
  .views((self: INotificationsModel) => ({
    get sortedNotifications(): INotificationModel[] {
      return self.notifications
    },
    get lastNotification(): INotificationModel {
      return self.notifications.find(Boolean) // get first element safely
    },
    liveNotificationToNotificationModel(liveNotification: ILiveNotification<any>): INotificationModel {
      return {
        ...liveNotification,
      }
    },
    get latest(): NotificationsSnapshotType[] {
      return orderBy(
        self.notifications.slice(),
        (notification: INotificationModel) => {
          return !isEmpty(notification) ? notification.messages[0].created_at : notification.created_at
        },
        ["desc"]
      )
    }
  }))
  .actions((self: INotificationsModel)  => ({
    afterCreate(): void {
      self.fetchNotifications()
    },
    fetchNotifications(): void {
      self.environment.api.get(ApiRoutes.NOTIFICATIONS)
        .then(self.afterSuccessfulFetch)
        .catch(noop)
    },
    afterSuccessfulFetch(notificationsResponse: ApiOkResponse<INotificationApiResponse>): void {
      self.currentPage = notificationsResponse.data.current_page
      self.maxPage = notificationsResponse.data.current_page
      self.notifications = notificationsResponse.data.data.map(self.createNewNotification)
    },
    createNewNotification(notification: INotification): INotificationModel {
      // @ts-ignore
      return NotificationModel.create(notification)
    },
    pushNewNotification(notification: INotification): INotificationModel {
      const newNotification = self.createNewNotification(notification)
      self.notifications.unshift(newNotification)

      return newNotification
    }
  }))

// tslint:disable-next-line:no-empty-interface
export interface INotificationsModel extends Instance<typeof NotificationsModel> {}
type NotificationsSnapshotType = SnapshotOut<typeof NotificationsModel>
// tslint:disable-next-line: no-empty-interface
export interface INotificationsSnapshot extends NotificationsSnapshotType {}
