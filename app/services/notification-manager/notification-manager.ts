/**
 * Manages notification sent by the backend
 */
import { IGroup } from "@models/group"
import { IService } from "@services/interfaces"
import { IGroupsModel } from "@models/groups"
import { IVoidCallbackArray } from "@custom-types/functions"
import { INotification, NotificationType } from "@services/api"
import autobind from "autobind-decorator"

/**
 * NotificationManager will handle the notifications coming from backend
 */
// tslint:disable-next-line: min-class-cohesion
export class NotificationManager implements IService {
  private readonly callbacks: IVoidCallbackArray
  private groupsModel: IGroupsModel

  public constructor() {
    this.callbacks[NotificationType.NEW_GROUP] = this.group
  }

  private group(group: IGroup): void {
    this.groupsModel.addGroup(group)
  }

  @autobind
  public notify(notification: INotification): void {
    this.callbacks[notification.type]()
  }

  public async setup(groupsModel: IGroupsModel): Promise<void> {
    this.groupsModel = groupsModel
  }
}
