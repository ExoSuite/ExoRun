import { IService } from "@services/interfaces"
import Sound from "react-native-sound"
import autobind from "autobind-decorator"

const mock = {
  play: (): null => null
}

export type SoundPlayerMock = typeof mock

/**
 * SoundPlayer will be the controller to handle app sounds and ringtones
 */
export class SoundPlayer implements IService {
  private errorSound: Sound | SoundPlayerMock
  private successSound: Sound | SoundPlayerMock

  @autobind
  public error(): void {
    this.errorSound.play()
  }

  public async setup(): Promise<void> {
    this.successSound = new Sound(require("./assets/Popcorn.mp3"))
    this.errorSound = new Sound(require("./assets/NFCFailure.mp3"))
  }

  public setupForTests(successSoundMock?: any, errorSoundMock?: any): void {
    this.successSound = successSoundMock || mock
    this.errorSound = errorSoundMock || mock
  }

  @autobind
  public success(): void {
    this.successSound.play()
  }
}
