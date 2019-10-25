import { NotificationsModel } from "@models/notifications"
import { Api } from "@services/api"

export const NotificationsModelMockData = {

}

export const NotificationsModelMockEnv = {
  environment: {
    api: new Api()
  }
}

export const NotificationsModelMock =
  NotificationsModel.create(
    {},
    NotificationsModelMockEnv
  )
