import { IService } from "@services/interfaces"
import Sound from "react-native-sound"
import autobind from "autobind-decorator"
import { noop } from "lodash-es"

const mock = {
  play: noop
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
    this.successSound = new Sound(require("./assets/popcorn.mp3"), noop)
    this.errorSound = new Sound(require("./assets/nfc_failure.mp3"), noop)
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
