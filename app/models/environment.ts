import { Api } from "@services/api"
import { Reactotron } from "@services/reactotron"
import { SoundPlayer } from "@services/sound-player"
import { SocketIo } from "@services/socket.io"
import { NotificationManager } from "@services/notification-manager"

/**
 * The environment Is a place where services and shared dependencies between
 * models live.  They are made available to every model via dependency injection.
 */
export class Environment {

  /**
   * Our api class to call ExoSuite Users API
   */
  public api: Api

  /**
   * Our notification manager to control notifications from backend
   */
  public notificationManager: NotificationManager

  /**
   * Reactotron Is only available in dev.
   */
  public reactotron: Reactotron

  /*
  * Our SocketIO controller
   */
  public socketIO: SocketIo

  /**
   * Our sound-player.
   */
  public soundPlayer: SoundPlayer
}
