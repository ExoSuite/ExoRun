import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { GroupModel } from "@models/group"
import { Api, IGroup, PersonalTokenImpl } from "@services/api"
import { ApiOkResponse } from "apisauce"
import { SocketIo } from "@services/socket.io"
import { noop } from "lodash-es"

/**
 * Model description here for TypeScript hints.
 */
export const GroupsModel = types
  .model("Groups")
  .props({
    groups: types.optional(types.array(GroupModel), []),
    currentPage: types.optional(types.number, 0),
    maxPage: types.optional(types.number, 0),
    api: types.frozen(Api),
    socketIO: types.frozen(SocketIo),
    messageToken: types.frozen(PersonalTokenImpl),
    pictureToken: types.frozen(PersonalTokenImpl),
  })
  .views((self: Instance<typeof GroupsModel>) => ({
    get latest(): IGroup[] { // will return the latest updated group
      return self.groups
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self: Instance<typeof GroupsModel>) => ({
    afterCreate(): void {
      self.fetchGroups()
    },
    afterSuccessfulFetch(groupsResponse: ApiOkResponse<{ current_page: number, data: IGroup[], last_page: number }>): void {
      self.currentPage = groupsResponse.data.current_page
      self.maxPage = groupsResponse.data.current_page

      self.groups = groupsResponse.data.data.map((group: IGroup) => (
        GroupModel.create({
          ...group,
          ...self.groupModelParams(group)
        })
      ))
    },
    fetchGroups(): void {
      self.api.get("user/me/groups")
        .then(self.afterSuccessfulFetch)
        .catch(noop)
    },
    groupModelParams(group: IGroup): object {
      return {
        channel: SocketIo.InstantiateChannel(group.id),
        api: self.api,
        messageToken: self.messageToken,
        pictureToken: self.pictureToken
      }
    },
    addGroup(group: IGroup): void {
      self.groups.unshift(GroupModel.create({
        ...group,
        ...self.groupModelParams(group)
      }))
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type GroupsType = Instance<typeof GroupsModel>

// tslint:disable-next-line:no-empty-interface
export interface IGroupsModel extends GroupsType {
}

type GroupsSnapshotType = SnapshotOut<typeof GroupsModel>

// tslint:disable-next-line:no-empty-interface interface-name
export interface GroupsSnapshot extends GroupsSnapshotType {
}
