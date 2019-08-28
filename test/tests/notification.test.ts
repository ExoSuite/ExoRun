import { NotificationModel, INotificationModel } from "@models/notification/notification"

test("can be created", () => {
  const instance: INotificationModel = NotificationModel.create({})

  expect(instance).toBeTruthy()
})
