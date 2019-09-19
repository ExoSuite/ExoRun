import initStoryshots from "@storybook/addon-storyshots"
import { merge } from "lodash-es"

jest.mock("global", () => merge(global, { window: { STORYBOOK_HOOKS_CONTEXT: "" } }));

describe("storybook tests", () => {
  initStoryshots({
    configPath: "./storybook",
    framework: "react-native"
  })
})
