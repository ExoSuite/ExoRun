// tslint:disable

import Echo from "laravel-echo"
import { Channel, PresenceChannel } from "laravel-echo/dist/channel"

export class SocketIo {

  public static get Echo(): Echo {
    return {
      join(channel: string): PresenceChannel {
        return {
          here(callback: Function): PresenceChannel {
            return undefined;
          }, joining(callback: Function): PresenceChannel {
            return undefined;
          }, leaving(callback: Function): PresenceChannel {
            return undefined;
          },
          // @ts-ignore
          listen: jest.fn()
        };
      }, listen(channel: string, event: string, callback: Function): Channel {
        return undefined;
      },
      connector: undefined, options: undefined, channel(channel: string) {
        return undefined;
      }, connect(): void {
      }, disconnect(): void {
      }, leave(channel: string): void {
      }, leaveChannel(channel: string): void {
      }, private(channel: string) {
        return undefined;
      }, registerAxiosRequestInterceptor(): any {
      }, registerInterceptors(): void {
      }, registerVueRequestInterceptor(): void {
      }, registerjQueryAjaxSetup(): void {
      }, socketId(): string {
        return "";
      }
    }
  }
}

