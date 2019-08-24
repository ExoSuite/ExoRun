import Echo from "laravel-echo"
import SocketIoClient from "socket.io-client/dist/socket.io"
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

  public get Echo(): Echo {
    return this._Echo
  }

  // tslint:disable-next-line:variable-name
  private _Echo: Echo

  public disconnect(): void {
    this._Echo.disconnect()
  }

  public instantiateChannel(groupId: string): SocketIoPresenceChannel {
    return new SocketIoPresenceChannel(groupId, this)
  }

  public notifications(user: IUser, callback: Function): void {
    if (this._Echo) {
      this._Echo.private(`${SocketIoChannel.USER}.${user.id}`)
        .notification(callback)
    }
  }

  // tslint:disable-next-line:prefer-function-over-method
  public async setup(): Promise<void> {
    let ioToken: IPersonalToken
    try {
      const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
      ioToken = personalTokens["connect-io-exorun"]
    } catch (error) {
      return
    }

    try {
      this._Echo = new Echo({
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
