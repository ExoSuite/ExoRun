import { NotificationModel, Notification } from "@models/notification/notification"

test("can be created", () => {
  const instance: Notification = NotificationModel.create({})

  expect(instance).toBeTruthy()
})
