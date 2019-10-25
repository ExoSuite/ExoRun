import { NotificationsModel, INotificationsModel } from "@models/notifications/notifications"
import { NotificationsModelMock, NotificationsModelMockEnv } from "../__mocks__/stores/NotificationsModelMock"
import { NotificationModelMockData } from "../__mocks__/stores/NotificationModelMock"

describe("notifications container", () => {
  test("can be created", () => {
    const instance: INotificationsModel = NotificationsModelMock

    expect(instance).toBeTruthy()
  })

  test("can create an instance of NotificationModel", () => {
    const instance: INotificationsModel = NotificationsModel.create({}, NotificationsModelMockEnv)

    instance.pushNewNotification(NotificationModelMockData)
    expect(instance.notifications).not.toHaveLength(0)
  })
})
