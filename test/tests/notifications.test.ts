import { NotificationsModel, INotificationsModel } from "@models/notifications/notifications"

describe("notifications container", () => {
  test("can be created", () => {
    const instance: INotificationsModel = NotificationsModel.create({})

    expect(instance).toBeTruthy()
  })

  test("can create an instance of NotificationModel", () => {
    const instance: INotificationsModel = NotificationsModel.create({})

    instance.createNotification({})
    expect(instance.notifications).not.toHaveLength(0)
  })
})
