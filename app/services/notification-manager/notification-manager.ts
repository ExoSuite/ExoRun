import { IService } from "@services/interfaces"
import { IGroupsModel } from "@models/groups"
import { IVoidCallbackArray, IVoidFunction } from "@custom-types/functions"
import { ILiveGroupNotification, ILiveNotification, IMessage, INotification, NotificationType } from "@services/api"
import autobind from "autobind-decorator"
import { SoundPlayer } from "@services/sound-player"
import { Notification } from "react-native-in-app-message"
import { INotificationsModel } from "@models/notifications"
import moment from "moment"
import { NotificationComponentManager } from "@components/notification-component"
import { NavigationStore } from "@navigation/navigation-store"
import { userIsOnChatScreen } from "@utils/userIsOnChatScreen"
import { NavigationLeafRoute } from "react-navigation"
import { IChatScreenNavigationProps } from "@screens/chat-screen"

/**
 * NotificationManager will handle the notifications coming from backend
 */
// tslint:disable-next-line: min-class-cohesion
@autobind
export class NotificationManager implements IService {
  public set navigationStore(value: NavigationStore) {
    this._navigationStore = value
  }

  public set notificationsModel(value: INotificationsModel) {
    this._notificationsModel = value
  }
  // tslint:disable-next-line:variable-name
  private _navigationStore: NavigationStore

  // tslint:disable-next-line:variable-name
  private _notificationsModel: INotificationsModel
  private addGroup: IVoidFunction
  private readonly callbacks: IVoidCallbackArray = []
  private readonly soundPlayer: SoundPlayer

  constructor(soundPlayer: SoundPlayer) {
    this.callbacks[NotificationType.NEW_GROUP] = this.group
    this.callbacks[NotificationType.NEW_MESSAGE] = this.message
    this.soundPlayer = soundPlayer
  }

  private group(notification: ILiveNotification<ILiveGroupNotification>): void {
    this.addGroup(notification.data.group)
    this.playNewNotification(notification)
  }

  private message(notification: ILiveNotification<IMessage>): void {
    const currentRoute: NavigationLeafRoute<IChatScreenNavigationProps> = this._navigationStore.findCurrentRoute()

    if (
      userIsOnChatScreen(currentRoute)
      && notification.data.group_id === currentRoute.params.group.id
    ) {
      return
    }

    this.playNewNotification(notification)
  }

  private playNewNotification(notification: ILiveNotification<any>): void {
    this.soundPlayer.playNewNotification()
    const now = moment.utc(moment.now()).format()
    // @ts-ignore
    const notificationModelData: INotification = {
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

  public notify(notification: ILiveNotification<any>): void {
    this.callbacks[notification.notification_type](notification)
  }

  public async setup(groupsModel: IGroupsModel): Promise<void> {
    this.addGroup = groupsModel.addGroup
  }
}
