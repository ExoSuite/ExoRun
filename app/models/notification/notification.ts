import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { IGroupNotificationData, IMessage, INotificationBaseData, NotificationType } from "@services/api"

// tslint:disable-next-line: completed-docs
class GroupNotificationData implements INotificationBaseData<IGroupNotificationData> {
  public data: IGroupNotificationData
  public notification_type: NotificationType
}

// tslint:disable-next-line: completed-docs
class MessageNotificationData implements INotificationBaseData<IMessage> {
  public data: IMessage
  public notification_type: NotificationType
}

/**
 * Model description here for TypeScript hints.
 */
export const NotificationModel = types
  .model("Notification")
  .props({
    id: types.string,
    type: types.string,
    notifiable_type: types.string,
    notifiable_id: types.string,
    data: types.union(
      types.frozen(GroupNotificationData),
      types.frozen(MessageNotificationData)
    ),
    read_at: types.maybeNull(types.string),
    created_at: types.string,
    updated_at: types.string,
  })
  .views((self: INotificationModel) => ({

  }))
  .actions((self: INotificationModel) => ({


  }))

export interface INotificationModel extends Instance<typeof NotificationModel> {}
type NotificationSnapshotType = SnapshotOut<typeof NotificationModel>
// tslint:disable-next-line:no-empty-interface
export interface INotificationSnapshot extends NotificationSnapshotType {}
