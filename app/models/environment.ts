import { Api } from "@services/api"
import { Reactotron } from "@services/reactotron"
import { SoundPlayer } from "@services/sound-player"

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
   * Reactotron Is only available in dev.
   */
  public reactotron: Reactotron

  /**
   * Our sound-player.
   */
  public soundPlayer: SoundPlayer
}
