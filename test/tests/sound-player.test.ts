import { SoundPlayer, SoundPlayerMock } from "@services/sound-player"
import { spy } from "sinon"

describe("sound player tests", () => {
  const soundPlayer: SoundPlayer = new SoundPlayer()
  const successSoundMock: SoundPlayerMock = { play: spy() }
  const errorSoundMock: SoundPlayerMock = { play: spy() }

  beforeAll(() => {
    soundPlayer.setupForTests(successSoundMock, errorSoundMock)
  })

  test("error sound must be called", () => {
    soundPlayer.error()
    // @ts-ignore
    expect(errorSoundMock.play.called).toBeTruthy()
  })

  test("success sound must be called", () => {
    soundPlayer.success()
    // @ts-ignore
    expect(successSoundMock.play.called).toBeTruthy()
  })
})
