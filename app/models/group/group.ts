import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { SocketIoPresenceChannel } from "@services/socket.io/socket.io.presence.channel"
import { IMessageModel, MessageModel } from "@models/message"
import { Api, IMessage, PersonalTokenImpl } from "@services/api"
import { SocketIoServerEvent } from "@services/socket.io/socket.io.server.event"
import { ApiOkResponse } from "apisauce"
import { noop } from "lodash-es"

const createMessage = (message: IMessage): IMessageModel => MessageModel.create(message)

/**
 * Model description here for TypeScript hints.
 */
export const GroupModel = types
  .model("Group")
  .props({
    created_at: types.string,
    updated_at: types.string,
    id: types.string,
    name: types.string,
    channel: types.frozen(SocketIoPresenceChannel),
    messages: types.optional(types.array(MessageModel), []),
    api: types.frozen(Api),
    messageToken: types.frozen(PersonalTokenImpl)
  })
  .views((self: Instance<typeof GroupModel>) => ({

  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self: Instance<typeof GroupModel>) => ({
    afterCreate(): void {
      self.channel.listen(SocketIoServerEvent.NEW_MESSAGE, (eventData: object) => {
        console.tron.logImportant(eventData)
      })
      self.fetchMessages()
    },
    fetchMessages(): void {
      self.api.get(`group/${self.id}/message`, {}, Api.BuildAuthorizationHeader(self.messageToken))
        .then(self.afterSuccessfulFetch)
        .catch(noop)
    },
    afterSuccessfulFetch(messageResponse: ApiOkResponse<{ data: IMessage[] }>): void {
      self.messages = messageResponse.data.data.map(createMessage)
    }

  }))

type GroupType = Instance<typeof GroupModel>

// tslint:disable-next-line:no-empty-interface interface-name
export interface Group extends GroupType {}
type GroupSnapshotType = SnapshotOut<typeof GroupModel>
// tslint:disable-next-line:no-empty-interface interface-name
export interface GroupSnapshot extends GroupSnapshotType {}
