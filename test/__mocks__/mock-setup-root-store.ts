const store = {
  env: {
    api: {},
    soundPlayer: {}
  },
  rootStore: {
    navigationStore: {
      actionSubscribers: (): {} => ({}),
      findCurrentRoute: (): {routeName: string} => ({routeName: ""})
    }
  }
}

export {
  store
}

jest.mock("../../app/models/root-store/setup-root-store", () => ({
  setupRootStore: async (): Promise<any> => store
}))
