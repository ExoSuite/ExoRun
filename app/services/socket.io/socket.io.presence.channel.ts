import { SocketIoServerEvent } from "@services/socket.io/socket.io.server.event"
import { SocketIo } from "@services/socket.io/socket.io"
import { SocketIoChannel } from "@services/socket.io/socket.io.channel"
import { SocketIoPresenceChannel as SocketIoPresenceChannelImpl } from "laravel-echo/dist/channel"

/**
 * SocketIo will be a bridge between our data and laravel-echo
 */
export class SocketIoPresenceChannel {

  private get channel(): string {
    return `${SocketIoChannel.GROUP}.${this.groupId}`
  }

  private readonly groupId: string
  private readonly presenceChannel: SocketIoPresenceChannelImpl

  constructor(groupId: string, socketIO: SocketIo) {
    this.groupId = groupId
    // @ts-ignore
    this.presenceChannel = socketIO.Echo.join(this.channel)
  }

  public here(callback: Function): void {
    this.presenceChannel.here(callback)
  }

  public joining(callback: Function): void {
    this.presenceChannel.joining(callback)
  }

  public leaving(callback: Function): void {
    this.presenceChannel.leaving(callback)
  }

  public listen(event: SocketIoServerEvent, callback: Function): void {
    this.presenceChannel.listen(event, callback)
  }
}
