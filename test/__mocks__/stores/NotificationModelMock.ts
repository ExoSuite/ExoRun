import { NotificationModel } from "@models/notification"
import { randomString } from "./lib/randomString"

export const NotificationModelMockData = {
  id: randomString(),
  created_at: randomString(),
  updated_at: randomString(),
  data: {
    data: {

    }
  }
}

export const NotificationModelMock = NotificationModel.create(NotificationModelMockData)
