import { IService } from "@services/interfaces"
import Sound from "react-native-sound"
import autobind from "autobind-decorator"

const mock = {
  play: (): null => null
}

type mockType = typeof mock

/**
 * SoundPlayer will be the controller to handle app sounds and ringtones
 */
export class SoundPlayer implements IService {
  private errorSound: Sound | mockType
  private successSound: Sound | mockType

  @autobind
  public error(): void {
    this.errorSound.play()
  }

  public async setup(): Promise<void> {
    this.successSound = new Sound(require("./assets/Popcorn.mp3"))
    this.errorSound = new Sound(require("./assets/NFCFailure.mp3"))
  }

  public setupForTests(): void {
    this.successSound = mock
    this.errorSound = mock
  }

  @autobind
  public success(): void {
    this.successSound.play()
  }
}
