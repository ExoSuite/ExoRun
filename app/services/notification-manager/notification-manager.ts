import { IService } from "@services/interfaces"
import { IGroupsModel } from "@models/groups"
import { IVoidCallbackArray, IVoidFunction } from "@custom-types/functions"
import { ILiveGroupNotification, ILiveNotification, NotificationType } from "@services/api"
import autobind from "autobind-decorator"
import { SoundPlayer } from "@services/sound-player"

/**
 * NotificationManager will handle the notifications coming from backend
 */
// tslint:disable-next-line: min-class-cohesion
@autobind
export class NotificationManager implements IService {
  private addGroup: IVoidFunction
  private readonly callbacks: IVoidCallbackArray = []
  private readonly soundPlayer: SoundPlayer

  constructor(soundPlayer: SoundPlayer) {
    this.callbacks[NotificationType.NEW_GROUP] = this.group
    this.soundPlayer = soundPlayer
  }

  private group(notification: ILiveNotification<ILiveGroupNotification>): void {
    this.addGroup(notification.data.group)
    this.soundPlayer.playAddedToGroup()
  }

  public notify(notification: ILiveNotification<any>): void {
    this.callbacks[notification.notification_type](notification)
  }

  public async setup(groupsModel: IGroupsModel): Promise<void> {
    this.addGroup = groupsModel.addGroup
  }
}
