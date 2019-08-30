import { IGroup } from "@models/group"
import { IMessage, ITimestamps, NotificationType } from "@services/api/api.types"

// see https://confluence.teamexosuite.cloud/display/APIDoc/Routes+documentation#/Notification/getNotification

export interface IGroupNotificationData {
  group: IGroup
  message: string
}

export interface INotificationBaseData<NotificationDataType> {
  data: NotificationDataType
  notification_type: NotificationType
}

export interface INotification extends ITimestamps {
  data: INotificationBaseData<IGroupNotificationData | IMessage>
  id: string
  notifiable_id: string
  notifiable_type: string
  read_at: string
  type: string
}

export interface INotificationApiResponse {
  current_page: number
  data: INotification[]
  last_page: number
}
