import { randomString } from "./lib/randomString"
import { IMessageModel } from "@models/message"

export const MessageModelMock: IMessageModel = {
  contents: randomString(),
  group_id: randomString(),
  id: randomString(),
  user_id: randomString(),
  created_at: randomString(),
  updated_at: randomString(),
  user: {
    id: randomString(),
    first_name: randomString(),
    last_name: randomString(),
    nick_name: randomString(),
  }
}
