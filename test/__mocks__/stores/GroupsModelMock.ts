import { Api, PersonalTokenImpl } from "@services/api"
import { SocketIo } from "@services/socket.io"

export const GroupsModelMockData = {
  api: new Api(),
  socketIO: new SocketIo(),
  messageToken: new PersonalTokenImpl()
}
