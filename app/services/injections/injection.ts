import { Api } from "@services/api"
import { Environment } from "@models/environment"
import { SoundPlayer } from "@services/sound-player"
import { DataLoader } from "@components/data-loader"
import { NavigationStore } from "@navigation/navigation-store"
import { IUserModel } from "@models/user-profile"
import { IGroupsModel } from "@models/groups"

export enum Injection {
  Environment = "env",
  NavigationStore = "navigationStore",
  Api = "api",
  SoundPlayer = "soundPlayer",
  UserModel = "userModel",
  GroupsModel = "groupsModel"
}

// tslint:disable-next-line:interface-name
interface InjectionPropsImpl {
  api: Api
  dataLoader: DataLoader
  env: Environment
  groupsModel: IGroupsModel
  navigationStore: NavigationStore
  soundPlayer: SoundPlayer,
  userModel: IUserModel,
}

export type InjectionProps = Partial<InjectionPropsImpl>
