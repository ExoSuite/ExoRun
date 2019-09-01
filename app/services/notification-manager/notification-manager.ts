import { IService } from "@services/interfaces"
import { IGroupsModel } from "@models/groups"
import { IVoidCallbackArray, IVoidFunction } from "@custom-types/functions"
import { ILiveGroupNotification, ILiveNotification, INotification, NotificationType } from "@services/api"
import autobind from "autobind-decorator"
import { SoundPlayer } from "@services/sound-player"
import { Notification } from "react-native-in-app-message"
import { INotificationsModel } from "@models/notifications"
import moment from "moment"
import { NotificationComponentManager } from "@components/notification-component"
import { noop } from "lodash-es"

/**
 * NotificationManager will handle the notifications coming from backend
 */
// tslint:disable-next-line: min-class-cohesion
@autobind
export class NotificationManager implements IService {
  // tslint:disable-next-line:variable-name
  private _notificationsModel: INotificationsModel
  private addGroup: IVoidFunction
  private readonly callbacks: IVoidCallbackArray = []
  private readonly soundPlayer: SoundPlayer

  constructor(soundPlayer: SoundPlayer) {
    this.callbacks[NotificationType.NEW_GROUP] = this.group
    this.callbacks[NotificationType.NEW_MESSAGE] = noop
    this.soundPlayer = soundPlayer
  }

  public set notificationsModel(value: INotificationsModel) {
    this._notificationsModel = value
  }

  private group(notification: ILiveNotification<ILiveGroupNotification>): void {
    this.addGroup(notification.data.group)
  }

  public notify(notification: ILiveNotification<any>): void {
    this.callbacks[notification.notification_type](notification)
    this.soundPlayer.playNewNotification()
    const now = moment.utc(moment.now()).format()
    // @ts-ignore
    const notificationModelData: INotification =  {
      id: notification.id,
      data: {
        // @ts-ignore
        data: {
          ...notification.data
        },
        notification_type: notification.notification_type
      },
      created_at: now,
      updated_at: now
    }
    NotificationComponentManager.FillNotification(
      this._notificationsModel.pushNewNotification(notificationModelData)
    )
    Notification.show()
  }

  public async setup(groupsModel: IGroupsModel): Promise<void> {
    this.addGroup = groupsModel.addGroup
  }
}
