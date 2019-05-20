import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { GroupModel } from "@models/group"
import { Api } from "@services/api"
import { ApiOkResponse } from "apisauce"

/**
 * Model description here for TypeScript hints.
 */
export const GroupsModel = types
  .model("Groups")
  .props({
    groups: types.optional(types.array(GroupModel), []),
    currentPage: types.optional(types.number, 0),
    maxPage: types.optional(types.number, 0),
    api: types.frozen(Api)
  })
  .views((self) => ({
    latest(): any { // will return the latest updated group
      return null
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self: Instance<typeof GroupsModel>) => ({
    async fetchGroups(): Promise<void> {
      let groupsResponse: ApiOkResponse<{current_page: number, data: [], last_page: number}>;
      try {
        groupsResponse = await self.api.get("user/me/groups")
      } catch (error) {
        return;
      }
      console.tron.log(groupsResponse)

      self.groups = groupsResponse.data.data
      self.currentPage = groupsResponse.data.current_page
      self.maxPage = groupsResponse.data.current_page
    },
    async afterCreate(): Promise<void> {
      // @ts-ignore
      await self.fetchGroups()
    },
    addGroup(group: any) {
      self.groups.unshift(group)
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type GroupsType = Instance<typeof GroupsModel>
export interface Groups extends GroupsType {}
type GroupsSnapshotType = SnapshotOut<typeof GroupsModel>
export interface GroupsSnapshot extends GroupsSnapshotType {}
