import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { IGroupNotificationData, IMessage, INotificationBaseData, NotificationType } from "@services/api"

// tslint:disable-next-line: completed-docs min-class-cohesion
abstract class NotificationData {
  public notification_type: NotificationType
}

// tslint:disable-next-line: completed-docs
class GroupNotificationData extends NotificationData implements INotificationBaseData<IGroupNotificationData> {
  public data: IGroupNotificationData

  public get authorUserId(): string {
    //return this.data.group.;
    return this.data.group.group_members.filter((groupMember: any) => groupMember.is_admin)
  }
}

// tslint:disable-next-line: completed-docs
class MessageNotificationData extends NotificationData implements INotificationBaseData<IMessage> {
  public data: IMessage
}

const parseMessageCallbacks = []
parseMessageCallbacks[NotificationType.NEW_GROUP] =
  (notification: GroupNotificationData): string => notification.data.message
parseMessageCallbacks[NotificationType.NEW_MESSAGE] =
  (notification: MessageNotificationData): string => `Nouveau message : ${notification.data.contents}`

const authorUserIdCallbacks = []
authorUserIdCallbacks[NotificationType.NEW_GROUP] =
  (notification: GroupNotificationData): string =>
    notification.data.group.group_members.filter((groupMember: any) => groupMember.is_admin)[0].user_id

authorUserIdCallbacks[NotificationType.NEW_MESSAGE] =
  (notification: MessageNotificationData): string => notification.data.user.id

/**
 * Model description here for TypeScript hints.
 */
export const NotificationModel = types
  .model("Notification")
  .props({
    id: types.string,
    type: types.maybeNull(types.string),
    notifiable_type: types.maybeNull(types.string),
    notifiable_id: types.maybeNull(types.string),
    data: types.union(
      types.frozen(GroupNotificationData),
      types.frozen(MessageNotificationData)
    ),
    read_at: types.maybeNull(types.string),
    created_at: types.string,
    updated_at: types.string,
  })
  .views((self: INotificationModel) => ({
    get parseMessage(): string {
      // @ts-ignore
      return parseMessageCallbacks[self.data.notification_type](self.data)
    },
    get authorUserId(): string {
      return authorUserIdCallbacks[self.data.notification_type](self.data)
    }
  }))
  .actions((self: INotificationModel) => ({

  }))

export interface INotificationModel extends Instance<typeof NotificationModel> {}
type NotificationSnapshotType = SnapshotOut<typeof NotificationModel>
// tslint:disable-next-line:no-empty-interface
export interface INotificationSnapshot extends NotificationSnapshotType {}
