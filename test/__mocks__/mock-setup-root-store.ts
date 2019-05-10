import { UserModelMock } from "./stores/UserModelMock"

const store = {
  env: {
    api: {},
    soundPlayer: {}
  },
  rootStore: {
    navigationStore: {
      actionSubscribers: (): {} => ({}),
      findCurrentRoute: (): { routeName: string } => ({ routeName: "" })
    }
  },
  userModel: UserModelMock
}

export {
  store
}

jest.mock("../../app/models/root-store/setup-root-store", () => ({
  setupRootStore: async (): Promise<any> => store
}))
