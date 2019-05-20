import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { GroupModel } from "@models/group"
import { Api, IGroup } from "@services/api"
import { ApiOkResponse } from "apisauce"
import { SocketIo } from "@services/socket.io"

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
    socketIO: types.frozen(SocketIo)
  })
  .views((self) => ({
    latest(): any { // will return the latest updated group
      return null
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self: Instance<typeof GroupsModel>) => ({
    afterCreate(): void {
      self.fetchGroups()
    },
    afterSuccessfulFetch(groupsResponse: ApiOkResponse<{ current_page: number, data: IGroup[], last_page: number }>): void {
      self.currentPage = groupsResponse.data.current_page
      self.maxPage = groupsResponse.data.current_page

      self.groups = groupsResponse.data.data.map((group: IGroup) => {
        return GroupModel.create({
          ...group,
          // @ts-ignore
          channel: SocketIo.InstantiateChannel(group.id)
        })
      })
    },
    fetchGroups(): void {
      self.api.get("user/me/groups")
        .then(self.afterSuccessfulFetch)
        .catch()
    },
    addGroup(group: IGroup): void {
      self.groups.unshift(GroupModel.create({
        ...group,
        // @ts-ignore
        channel: SocketIo.InstantiateChannel(group.id)
      }))
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type GroupsType = Instance<typeof GroupsModel>

export interface IGroupsModel extends GroupsType {
}

type GroupsSnapshotType = SnapshotOut<typeof GroupsModel>

export interface GroupsSnapshot extends GroupsSnapshotType {
}
