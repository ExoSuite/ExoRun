import { UserModelMock } from "./stores/UserModelMock"
import { IAppState } from "../../app/app"
import { Environment } from "@models/environment"
import { GroupsModelMockData } from "./stores/GroupsModelMock"
import { NotificationModelMock } from "./stores/NotificationModelMock"

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

const appState: IAppState = {
  env: new Environment(),
  groupsModel: GroupsModelMockData,
  notificationsModel: NotificationModelMock,
  rootStore: {
    navigationStore: {
      actionSubscribers: (): {} => ({}),
      findCurrentRoute: (): { routeName: string } => ({ routeName: "" })
    }
  },
  userModel: UserModelMock
}

export {
  store,
  appState
}

jest.mock("../../app/models/root-store/setup-root-store", () => ({
  setupRootStore: async (): Promise<any> => store
}))
