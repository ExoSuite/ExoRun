import { SoundPlayer } from "@services/sound-player"
import { spy } from "sinon"
import Sound from "react-native-sound"

const soundMock = { play: spy(), setVolume: spy(), setSpeed: spy() }

describe("sound player tests", () => {
  const soundPlayer: SoundPlayer = new SoundPlayer()
  // @ts-ignore
  const successSoundMock: Sound = soundMock
  // @ts-ignore
  const errorSoundMock: Sound = soundMock
  // @ts-ignore
  const sendMock: Sound = soundMock
  // @ts-ignore
  const receiveMock: Sound = soundMock

  beforeAll(() => {
    soundPlayer.setupForTests(successSoundMock, errorSoundMock, sendMock, receiveMock)
  })

  test("error sound must be called", () => {
    soundPlayer.playError()
    // @ts-ignore
    expect(errorSoundMock.play.called).toBeTruthy()
    // @ts-ignore
    expect(errorSoundMock.setVolume.called).toBeTruthy()
  })

  test("success sound must be called", () => {
    soundPlayer.playSuccess()
    // @ts-ignore
    expect(successSoundMock.play.called).toBeTruthy()
    // @ts-ignore
    expect(successSoundMock.setVolume.called).toBeTruthy()
  })

  test("send message sound must be called", () => {
    soundPlayer.playSendMessage()
    // @ts-ignore
    expect(sendMock.play.called).toBeTruthy()
    // @ts-ignore
    expect(sendMock.setVolume.called).toBeTruthy()
  })

  test("receive message sound must be called", () => {
    soundPlayer.playReceiveMessage()
    // @ts-ignore
    expect(receiveMock.play.called).toBeTruthy()
    // @ts-ignore
    expect(receiveMock.setVolume.called).toBeTruthy()
  })
})
