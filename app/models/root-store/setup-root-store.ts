import { Environment } from "@models/environment"
import { Api, IPersonalTokens } from "@services/api"
import { Reactotron } from "@services/reactotron"
import { SoundPlayer } from "@services/sound-player"
import * as storage from "@utils/storage"
import { onSnapshot } from "mobx-state-tree"
import { RootStore, RootStoreModel, RootStoreSnapshot } from "./root-store"
import { IUserModel, IUserModelSnapshot, UserModel } from "@models/user-profile"
import { GroupsModel, IGroupsModel } from "@models/groups"
import { SocketIo } from "@services/socket.io"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { ApiTokenManager } from "@services/api/api.token.manager"
import { NotificationManager } from "@services/notification-manager"
import { INotificationsModel, NotificationsModel } from "@models/notifications"

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = "root"

interface ISetupRootStore {
  env: Environment
  groupsModel: IGroupsModel
  notificationsModel: INotificationsModel
  rootStore: RootStore
  userModel: IUserModel
}

/**
 * Setup the root state.
 */
export async function setupRootStore(): Promise<ISetupRootStore> {
  let rootStore: RootStore
  let data: any

  // prepare the environment that will be associated with the RootStore.
  const env = await createEnvironment()
  try {
    // load data from storage
    data = (await storage.load(ROOT_STATE_STORAGE_KEY)) || {}
    rootStore = RootStoreModel.create(data)
  } catch (error) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
    // @ts-ignore
    rootStore = RootStoreModel.create({})

    // but please inform us what happened
    if (__DEV__) {
      console.tron.error(error.message, null)
    }
  }

  // reactotron logging
  if (__DEV__) {
    env.reactotron.setRootStore(rootStore, data)
  }

  // track changes & save to storage
  onSnapshot(rootStore, (snapshot: RootStoreSnapshot): Promise<boolean> => (
    storage.save(ROOT_STATE_STORAGE_KEY, snapshot)
  ))

  const userData = await storage.load(storage.StorageTypes.USER_PROFILE)
  const userModel = UserModel.create(userData)
  onSnapshot(userModel, (snapshot: IUserModelSnapshot): Promise<boolean> => {
    return storage.save(storage.StorageTypes.USER_PROFILE, snapshot)
  })

  let personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens

  if (!personalTokens) {
    personalTokens = {
      // @ts-ignore
      "message-exorun": {
        accessToken: ""
      },
      // @ts-ignore
      "view-picture-exorun": {
        accessToken: ""
      }
    }
  }

  const groupsModel = GroupsModel.create({
    messageToken: personalTokens["message-exorun"],
    pictureToken: personalTokens["view-picture-exorun"]
  }, {
    environment: env,
    userModel
  })

  await env.notificationManager.setup(groupsModel)
  env.socketIO.notifications(userModel, env.notificationManager.notify)
  const notificationsModel = NotificationsModel.create({}, {environment: env});
  env.notificationManager.notificationsModel = notificationsModel
  env.notificationManager.navigationStore = rootStore.navigationStore
  env.soundPlayer.navigationStore = rootStore.navigationStore

  return {
    rootStore,
    env,
    userModel,
    groupsModel,
    notificationsModel
  }
}

/**
 * Setup the environment that all the models will be sharing.
 *
 * The environment includes other functions that will be picked from some
 * of the models that get created later. This Is how we loosly couple things
 * like events between models.
 */
export async function createEnvironment(): Promise<Environment> {
  const env = new Environment()

  // create each service
  env.reactotron = new Reactotron()
  env.api = new Api()
  env.soundPlayer = new SoundPlayer()
  env.socketIO = new SocketIo()
  env.notificationManager = new NotificationManager(env.soundPlayer)

  await ApiTokenManager.Setup()

  // allow each service to setup
  await Promise.all([
    env.reactotron.setup(),
    env.api.setup(),
    env.soundPlayer.setup(),
  ])
  await env.socketIO.setup()

  return env
}
