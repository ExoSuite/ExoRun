import { getEnv, Instance, SnapshotOut, types } from "mobx-state-tree"
import { GroupModel, IGroup } from "@models/group"
import { IPersonalTokens, PersonalTokenImpl } from "@services/api"
import { ApiOkResponse } from "apisauce"
import { isEmpty, noop, orderBy } from "lodash-es"
import { withEnvironment } from "@models/extensions"
import { Environment } from "@models/environment"
import { IUserModel } from "@models/user-profile"

export interface IGroupsInjectedEnvironment {
  environment: Environment,
  userModel: IUserModel
}

/**
 * Model description here for TypeScript hints.
 */
export const GroupsModel = types
  .model("Groups")
  .props({
    groups: types.optional(types.array(GroupModel), []),
    currentPage: types.optional(types.number, 0),
    maxPage: types.optional(types.number, 0),
    messageToken: types.frozen(PersonalTokenImpl),
    pictureToken: types.frozen(PersonalTokenImpl)
  })
  .extend(withEnvironment)
  .views((self: Instance<typeof GroupsModel>) => ({
    get latest(): IGroup[] {
      return orderBy(
        self.groups.slice(),
        (group: IGroup) => {
          return !isEmpty(group.messages) ? group.messages[0].created_at : group.created_at
        },
        ["desc"]
      )
    }
  }))
  // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self: Instance<typeof GroupsModel>) => ({
    afterCreate(): void {
      self.fetchGroups()
    },
    afterSuccessfulFetch(groupsResponse: ApiOkResponse<{ current_page: number, data: IGroup[], last_page: number }>): void {
      self.currentPage = groupsResponse.data.current_page
      self.maxPage = groupsResponse.data.current_page
      const env = getEnv<IGroupsInjectedEnvironment>(self);
      self.groups = groupsResponse.data.data.map((group: IGroup) => self.createNewGroup(env, group))
    },
    fetchGroups(): void {
      self.environment.api.get("user/me/groups")
        .then(self.afterSuccessfulFetch)
        .catch(noop)
    },
    groupModelParams(group: IGroup): object {
      return {
        channel: self.environment.socketIO.instantiateChannel(group.id),
        messageToken: self.messageToken,
        pictureToken: self.pictureToken
      }
    },
    addGroup(group: IGroup): void {
      self.groups.unshift(self.createNewGroup(getEnv(self), group))
    },
    updateTokens(tokens: IPersonalTokens): void {
      self.pictureToken = tokens["view-picture-exorun"]
      self.messageToken = tokens["message-exorun"]
    },
    createNewGroup(env: IGroupsInjectedEnvironment, group: IGroup): IGroup {
      return GroupModel.create({
        ...group,
        ...self.groupModelParams(group)
      }, env)
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
