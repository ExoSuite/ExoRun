import { IService } from "@services/interfaces"
import Sound from "react-native-sound"
import autobind from "autobind-decorator"
import { noop } from "lodash-es"
import { userIsOnChatScreen } from "@utils/userIsOnChatScreen"
import { NavigationStore } from "@navigation/navigation-store"

/**
 * SoundPlayer will be the controller to handle app sounds and ringtones
 */
// tslint:disable-next-line: min-class-cohesion
@autobind
export class SoundPlayer implements IService {
  public set navigationStore(value: NavigationStore) {
    this._navigationStore = value
  }
  // tslint:disable-next-line:variable-name
  private _navigationStore: NavigationStore
  private addedToGroupSound: Sound
  private errorSound: Sound
  private receiveMessageSound: Sound
  private sendMessageSound: Sound
  private successSound: Sound

  public playError(): void {
    this.errorSound.setVolume(0.5)
    this.errorSound.play()
  }

  public playNewNotification(): void {
    this.addedToGroupSound.setVolume(0.15)
    this.addedToGroupSound.play()
  }

  public playReceiveMessage(): void {
    if (!userIsOnChatScreen(this._navigationStore.findCurrentRoute())) { return }

    this.receiveMessageSound.setVolume(0.05)
    this.receiveMessageSound.setSpeed(1.25)
    this.receiveMessageSound.play()
  }

  public playSendMessage(): void {
    this.sendMessageSound.setVolume(0.1)
    this.sendMessageSound.setSpeed(1.25)
    this.sendMessageSound.play()
  }

  public playSuccess(): void {
    this.successSound.setVolume(0.5)
    this.successSound.play()
  }

  public async setup(): Promise<void> {
    this.successSound = new Sound(require("./assets/popcorn.mp3"), noop)
    this.errorSound = new Sound(require("./assets/nfc_failure.mp3"), noop)
    this.sendMessageSound = new Sound(require("./assets/send_message.mp3"), noop)
    this.receiveMessageSound = new Sound(require("./assets/receive_message.mp3"), noop)
    this.addedToGroupSound = new Sound(require("./assets/new_group.mp3"), noop)
  }

  // tslint:disable-next-line: max-func-args
  public setupForTests(successMock: Sound, errorMock: Sound, sendMock: Sound, receiveMock: Sound): void {
    this.successSound = successMock
    this.errorSound = errorMock
    this.sendMessageSound = sendMock
    this.receiveMessageSound = receiveMock
  }
}
