// tslint:disable
import { RootStore } from "@models/root-store"
import { IService } from "@services/interfaces"
import { onSnapshot } from "mobx-state-tree"
import { mst } from "reactotron-mst"
import Tron, { openInEditor } from "reactotron-react-native"
import { commandMiddleware } from "./command-middleware"
import { DEFAULT_REACTOTRON_CONFIG, ReactotronConfig } from "./reactotron-config"

// Teach TypeScript about the bad things we want to do.
declare global {
  interface Console {
    /**
     * Hey, it's Reactotron if we're in dev, and no-ops if we're in prod.
     */
    tron: typeof Tron
  }
}

/** Do Nothing. */
const noop = () => undefined

// in dev, we attach Reactotron, in prod we attach a interface-compatible mock.
if (__DEV__) {
  console.tron = Tron // attach reactotron to `console.tron`
} else {
  // attach a mock so if things sneaky by our __DEV__ guards, we won't crash.
  // @ts-ignore
  console.tron = {
    configure: noop,
    connect: noop,
    use: noop,
    useReactNative: noop,
    clear: noop,
    log: noop,
    logImportant: noop,
    display: noop,
    error: noop,
    image: noop,
    reportError: noop
  }
}

/**
 * You'll probably never use the service like this since we hang the Reactotron
 * Instance off of `console.tron`. This is only to be consistent with the other
 * services.
 */
export class Reactotron implements IService {

  public config: ReactotronConfig
  public rootStore: any

  /**
   * Create the Reactotron service.
   *
   * @param config the configuration
   */
  constructor(config: ReactotronConfig = DEFAULT_REACTOTRON_CONFIG) {
    // merge the passed in config with some defaults
    this.config = {
      useAsyncStorage: true,
      ...config,
      state: {
        initial: false,
        snapshots: false,
        ...(config && config.state)
      }
    }
  }

  /**
   * Hook into the root store for doing awesome state-related things.
   *
   * @param rootStore The root store
   * @param initialData
   */
  public setRootStore(rootStore: any, initialData: any) {
    if (__DEV__) {
      rootStore = rootStore as RootStore // typescript hack
      this.rootStore = rootStore

      const { initial, snapshots } = this.config.state
      const name = "ROOT STORE"

      // logging features
      if (initial) {
        console.tron.display({ name, value: initialData, preview: "Initial State" })
      }
      // log state changes?
      if (snapshots) {
        onSnapshot(rootStore, (snapshot) => {
          console.tron.display({ name, value: snapshot, preview: "New State" })
        })
      }

      // @ts-ignore
      console.tron.trackMstNode(rootStore)
    }
  }

  /**
   * Configure reactotron based on the the config settings passed in, then connect if we need to.
   */
  public async setup() {
    // only run this in dev... metro bundler will ignore this block: 🎉
    if (__DEV__) {
      // configure reactotron
      Tron.configure({
        name: this.config.name || require("../../../package.json").name,
        host: this.config.host
      })

      // hookup middleware
      Tron.useReactNative({
        asyncStorage: this.config.useAsyncStorage ? undefined : false,
        editor: true
      })

      // ignore some chatty `mobx-state-tree` actions
      const RX = /postProcessSnapshot|@APPLY_SNAPSHOT/

      // hookup mobx-state-tree middleware
      Tron.use(
        mst({
          filter: (event) => !RX.test(event.name)
        })
      )

      Tron.use(openInEditor())

      // hookup custom command middleware
      Tron.use(commandMiddleware(() => this.rootStore))

      // connect to the app
      Tron.connect()

      // clear if we should
      if (this.config.clearOnLoad) {
        Tron.clear()
      }
    }
  }
}
