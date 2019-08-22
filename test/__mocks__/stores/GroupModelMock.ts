import { randomString } from "./lib/randomString"
import { IGroup } from "@models/group"
import { SocketIoPresenceChannel } from "@services/socket.io/socket.io.presence.channel"
import { PersonalTokenImpl } from "@services/api"

export const GroupModelMockData: IGroup = {
  created_at: randomString(),
  id: randomString(),
  name: randomString(),
  updated_at: randomString(),
  nick_name: randomString(),
  channel: new SocketIoPresenceChannel(randomString()),
  messageToken: new PersonalTokenImpl(),
  pictureToken: new PersonalTokenImpl()
}
