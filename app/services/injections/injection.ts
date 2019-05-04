import { Api } from "@services/api"
import { Environment } from "@models/environment"
import { SoundPlayer } from "@services/sound-player"
import { DataLoader } from "@components/data-loader"
import { NavigationStore } from "@navigation/navigation-store"

export enum Injection {
  Environment = "env",
  NavigationStore = "navigationStore",
  Api = "api",
  SoundPlayer = "soundPlayer",
  DataLoader = "dataLoader",
}

// tslint:disable-next-line:interface-name
interface InjectionPropsImpl {
  api: Api
  dataLoader: DataLoader
  env: Environment
  navigationStore: NavigationStore
  soundPlayer: SoundPlayer
}

export type InjectionProps = Partial<InjectionPropsImpl>
