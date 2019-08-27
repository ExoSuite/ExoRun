import { NotificationsModel, INotifications } from "@models/notifications/notifications"

describe("notifications container", () => {
  test("can be created", () => {
    const instance: INotifications = NotificationsModel.create({})

    expect(instance).toBeTruthy()
  })

  test("can create an instance of NotificationModel", () => {
    const instance: INotifications = NotificationsModel.create({})

    instance.createNotification({})
    expect(instance.notifications).not.toHaveLength(0)
  })
})
