import { Api } from "@services/api"
import { SocketIo } from "@services/socket.io"
import { IGroupsInjectedEnvironment } from "@models/groups"
import { UserModel } from "@models/user-profile"
import { UserModelMockData } from "./UserModelMock"
import { Reactotron } from "@services/reactotron"
import { SoundPlayer } from "@services/sound-player"
import { NotificationManager } from "@services/notification-manager"

const soundPlayer = new SoundPlayer()

export const MobxStateTreeEnvMock: IGroupsInjectedEnvironment = {
  environment: {
    api: new Api(),
    reactotron: new Reactotron(),
    socketIO: new SocketIo(),
    soundPlayer,
    notificationManager: new NotificationManager(soundPlayer)
  },
  userModel: UserModel.create(UserModelMockData)
}
