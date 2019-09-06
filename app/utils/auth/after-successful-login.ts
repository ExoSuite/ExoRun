import { reset, save } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { DataLoader } from "@components/data-loader"
import { AppScreens } from "@navigation/navigation-definitions"
import { ApiResponse } from "apisauce"
import { ITokenResponse } from "@services/api"
import { IGroupsModel } from "@models/groups"
import { Environment } from "@models/environment"
import { IUserModel } from "@models/user-profile"
import { NavigationParams } from "react-navigation"
import { INotificationsModel } from "@models/notifications"
import { clear } from "@utils/storage"
import { clearAllStorage } from "@utils/storage/clearAllStorage"

// tslint:disable-next-line:max-func-args
export async function afterSuccessfulLogin(
  response: ApiResponse<ITokenResponse>,
  groupsModel: IGroupsModel,
  notificationModel: INotificationsModel,
  userModel: IUserModel,
  environment: Environment,
  navigation: NavigationParams
): Promise<void> {
  await clearAllStorage()
  await save(response.data, Server.EXOSUITE_USERS_API)
  groupsModel.updateTokens(await environment.api.getOrCreatePersonalTokens())
  await Promise.all([environment.socketIO.setup(), environment.api.getProfile(userModel)])
  groupsModel.fetchGroups()
  notificationModel.fetchNotifications()
  await environment.notificationManager.setup(groupsModel)
  environment.socketIO.notifications(userModel, environment.notificationManager.notify)

  DataLoader.Instance.success(
    environment.soundPlayer.playSuccess,
    () => {
      navigation.navigate(AppScreens.HOME)
    })
}
