import { randomString } from "./lib/randomString"

export const MessageModelMock = {
  contents: randomString(),
  group_id: randomString(),
  id: randomString(),
  user_id: randomString(),
  created_at: randomString(),
  updated_at: randomString()
}
