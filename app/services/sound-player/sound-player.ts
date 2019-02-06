import Sound from "react-native-sound"
import { IService } from "@services/interfaces"

const mock = {
  play: () => {}
}

export class SoundPlayer implements IService {
  private successSound;
  private errorSound;

  success() {
    this.successSound.play();
  }

  error() {
    this.errorSound.play()
  }

  async setup() {
    this.successSound = new Sound(require('./assets/Popcorn.mp3'));
    this.errorSound = new Sound(require('./assets/NFCFailure.mp3'));
  }

  async setupForTests() {
    this.successSound = mock
    this.errorSound = mock
  }
}
