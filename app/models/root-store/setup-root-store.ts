import { Environment } from "@models/environment"
import { Api } from "@services/api"
import { Reactotron } from "@services/reactotron"
import { SoundPlayer } from "@services/sound-player"
import * as storage from "@utils/storage"
import { onSnapshot } from "mobx-state-tree"
import { RootStore, RootStoreModel, RootStoreSnapshot } from "./root-store"

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = "root"

interface ISetupRootStore {
  env: Environment
  rootStore: RootStore,
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

  return {
    rootStore,
    env,
  }
}

/**
 * Setup the environment that all the models will be sharing.
 *
 * The environment includes other functions that will be picked from some
 * of the models that get created later. This is how we loosly couple things
 * like events between models.
 */
export async function createEnvironment(): Promise<Environment> {
  const env = new Environment()

  // create each service
  env.reactotron = new Reactotron()
  env.api = new Api()
  env.soundPlayer = new SoundPlayer()

  // allow each service to setup
  await env.reactotron.setup()
  await env.api.setup()
  await env.soundPlayer.setup()

  return env
}
