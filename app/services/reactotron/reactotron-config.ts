import Config from "react-native-config"

// tslint:disable

export interface ReactotronConfig {
  /** Should we clear Reactotron when load? */
  clearOnLoad?: boolean
  /** The host to connect to: default 'localhost'. */
  host?: string
  /** The name of the app. */
  name?: string
  /** Root state logging. */
  state?: {
    /** log the initial data that we put into the state on startup? */
    initial?: boolean;
    /** log snapshot changes. */
    snapshots?: boolean;
  }
  /** Should we use async storage */
  useAsyncStorage?: boolean
}

/**
 * The default Reactotron configuration.
 */
export const DEFAULT_REACTOTRON_CONFIG: ReactotronConfig = {
  clearOnLoad: true,
  host: Config.REACTOTRON_HOST,
  useAsyncStorage: true,
  state: {
    initial: true,
    snapshots: false,
  },
}
