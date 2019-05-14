import initStoryshots from "@storybook/addon-storyshots"

describe("storybook tests", () => {
  initStoryshots({
    configPath: "./storybook",
    framework: "react-native"
  })
})
