import { Api } from "@services/api"
import { SocketIo } from "@services/socket.io"
import { IGroupsInjectedEnvironment } from "@models/groups"
import { UserModel } from "@models/user-profile"
import { UserModelMockData } from "./UserModelMock"
import { Reactotron } from "@services/reactotron"
import { SoundPlayer } from "@services/sound-player"

export const MobxStateTreeEnvMock: IGroupsInjectedEnvironment = {
  environment: {
    api: new Api(),
    reactotron: new Reactotron(),
    socketIO: new SocketIo(),
    soundPlayer: new SoundPlayer()
  },
  userModel: UserModel.create(UserModelMockData)
}
