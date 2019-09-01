import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { SocketIoPresenceChannel } from "@services/socket.io/socket.io.presence.channel"
import { IMessageModel, MessageModel } from "@models/message"
import { Api, IMessage, PersonalTokenImpl } from "@services/api"
import { SocketIoServerEvent } from "@services/socket.io/socket.io.server.event"
import { ApiOkResponse } from "apisauce"
import { noop } from "lodash-es"
import { IMessage as IMessageRNGC } from "react-native-gifted-chat/lib/types"
import { withEnvironment } from "@models/extensions"
import { withUserModel } from "@models/extensions/with-user-model"

const createMessage = (message: IMessageModel): IMessageModel => MessageModel.create(message)

/**
 * Model description here for TypeScript hints.
 */
export const GroupModel = types
  .model("Group")
  .extend(withEnvironment)
  .extend(withUserModel)
  .props({
    created_at: types.string,
    updated_at: types.string,
    id: types.string,
    name: types.string,
    channel: types.frozen(SocketIoPresenceChannel),
    messages: types.optional(types.array(MessageModel), []),
    messageToken: types.frozen(PersonalTokenImpl),
    pictureToken: types.frozen(PersonalTokenImpl)
  })
  .views((self: Instance<typeof GroupModel>) => ({
    get toRNGCMessagesFormat(): IMessageRNGC[] {
      return self.messages.map((message: IMessageModel) => ({
        _id: message.id,
        text: message.contents,
        createdAt: message.created_at,
        user: {
          _id: message.user_id,
          name: `${message.user.first_name} ${message.user.last_name}`,
          avatar: self.environment.api.buildAvatarUrl(message.user.id, self.pictureToken.accessToken)
        }
      }))
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self: Instance<typeof GroupModel>) => ({
    afterCreate(): void {
      self.channel.listen(SocketIoServerEvent.NEW_MESSAGE, self.pushMessage)
      self.fetchMessages()
    },
    fetchMessages(): void {
      self.environment.api.get(
        `group/${self.id}/message`,
        {},
        Api.BuildAuthorizationHeader(self.messageToken)
      )
        .then(self.afterSuccessfulRequest)
        .catch(noop)
    },
    afterSuccessfulRequest(messageResponse: ApiOkResponse<{ data: IMessage[] }>): void {
      self.messages = messageResponse.data.data.map(createMessage)
    },
    addMessage(newMessage: { text: string }): void {
      self.environment.soundPlayer.playSendMessage()
      self.environment.api.post(
        `group/${self.id}/message`,
        { contents: newMessage.text },
        Api.BuildAuthorizationHeader(self.messageToken)
      ).catch(noop)
    },
    pushMessage(newMessage: IMessage): void {
      if (self.userModel.id !== newMessage.user_id) {
        self.environment.soundPlayer.playReceiveMessage()
      }

      self.messages.unshift(createMessage(newMessage))
    }

  }))

type GroupType = Instance<typeof GroupModel>

// tslint:disable-next-line:no-empty-interface
export interface IGroup extends GroupType {
}

type GroupSnapshotType = SnapshotOut<typeof GroupModel>

// tslint:disable-next-line:no-empty-interface interface-name
export interface GroupSnapshot extends GroupSnapshotType {
}
