import { randomString } from "./lib/randomString"
import { Group } from "@models/group"
import { SocketIoPresenceChannel } from "@services/socket.io/socket.io.presence.channel"
import { Api, PersonalTokenImpl } from "@services/api"

export const GroupModelMockData: Group = {
  created_at: randomString(),
  id: randomString(),
  name: randomString(),
  updated_at: randomString(),
  nick_name: randomString(),
  channel: new SocketIoPresenceChannel(randomString()),
  api: new Api(),
  messageToken: new PersonalTokenImpl()
}
