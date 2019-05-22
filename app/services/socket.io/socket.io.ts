import Echo from "laravel-echo"
import SocketIoClient from "socket.io-client"
import { IService } from "@services/interfaces"
import Config from "react-native-config"
import { IPersonalToken, IPersonalTokens, IUser } from "@services/api"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { SocketIoPresenceChannel } from "@services/socket.io/socket.io.presence.channel"
import { SocketIoChannel } from "@services/socket.io/socket.io.channel"

/**
 * SocketIo will handle the connection with the laravel-echo-server
 */
// tslint:disable-next-line: min-class-cohesion
export class SocketIo implements IService {

  public static get Echo(): Echo {
    return SocketIo._Echo
  }

  // tslint:disable-next-line:variable-name
  private static _Echo: Echo

  public static InstantiateChannel(groupId: string): SocketIoPresenceChannel {
    return new SocketIoPresenceChannel(groupId)
  }

  public static Notifications(user: IUser, callback: Function): void {
    SocketIo._Echo.private(`${SocketIoChannel.USER}.${user.id}`)
      .notification(callback)
  }

  // tslint:disable-next-line: prefer-function-over-method
  public async setup(): Promise<void> {

    let ioToken: IPersonalToken
    try {
      const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
      ioToken = personalTokens["connect-io-exorun"]
    } catch (error) {
      return
    }

    try {
      SocketIo._Echo = new Echo({
        broadcaster: "socket.io",
        host: `wss://${Config.IO_SERVER}`,
        client: SocketIoClient,
        auth: {
          headers: {
            "Authorization": `Bearer ${ioToken.accessToken}`
          }
        }
      })
    } catch (error) {
      return
    }
  }

}
