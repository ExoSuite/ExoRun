import { randomString } from "./lib/randomString"
import { IGroup } from "@models/group"
import { SocketIoPresenceChannel } from "@services/socket.io/socket.io.presence.channel"
import { PersonalTokenImpl } from "@services/api"
import { noop } from "lodash-es"
import Echo from "laravel-echo"

export const GroupModelMockData: IGroup = {
  created_at: randomString(),
  id: randomString(),
  name: randomString(),
  updated_at: randomString(),
  nick_name: randomString(),
  // @ts-ignore
  channel: new SocketIoPresenceChannel(randomString(), {
    get Echo(): Echo {
      // @ts-ignore
      return {
        join: (): any => ({
          listen: noop
        })
      }
    }
  }),
  messageToken: new PersonalTokenImpl(),
  pictureToken: new PersonalTokenImpl()
}
