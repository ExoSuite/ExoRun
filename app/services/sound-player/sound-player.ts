import { IService } from "@services/interfaces"
import Sound from "react-native-sound"
import autobind from "autobind-decorator"
import { noop } from "lodash-es"

/**
 * SoundPlayer will be the controller to handle app sounds and ringtones
 */
// tslint:disable-next-line: min-class-cohesion
export class SoundPlayer implements IService {
  private errorSound: Sound
  private receiveMessageSound: Sound
  private sendMessageSound: Sound
  private successSound: Sound

  @autobind
  public playError(): void {
    this.errorSound.setVolume(0.75)
    this.errorSound.play()
  }

  @autobind
  public playReceiveMessage(): void {
    this.receiveMessageSound.setVolume(0.05)
    this.receiveMessageSound.setSpeed(1.25)
    this.receiveMessageSound.play()
  }

  @autobind
  public playSendMessage(): void {
    this.sendMessageSound.setVolume(0.1)
    this.sendMessageSound.setSpeed(1.25)
    this.sendMessageSound.play()
  }

  @autobind
  public playSuccess(): void {
    this.successSound.setVolume(0.75)
    this.successSound.play()
  }

  public async setup(): Promise<void> {
    this.successSound = new Sound(require("./assets/popcorn.mp3"), noop)
    this.errorSound = new Sound(require("./assets/nfc_failure.mp3"), noop)
    this.sendMessageSound = new Sound(require("./assets/send_message.mp3"), noop)
    this.receiveMessageSound = new Sound(require("./assets/receive_message.mp3"), noop)
  }

  // tslint:disable-next-line: max-func-args
  public setupForTests(successMock: Sound, errorMock: Sound, sendMock: Sound, receiveMock: Sound): void {
    this.successSound = successMock
    this.errorSound = errorMock
    this.sendMessageSound = sendMock
    this.receiveMessageSound = receiveMock
  }
}
