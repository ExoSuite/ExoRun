import { NotificationModel, INotificationModel } from "@models/notification/notification"
import { NotificationModelMockData } from "../__mocks__/stores/NotificationModelMock"

describe("notification model", () => {
  test("can be created", () => {
    const instance: INotificationModel = NotificationModel.create(NotificationModelMockData)

    expect(instance).toBeTruthy()
  })
})
