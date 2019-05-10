import { Instance, SnapshotOut, types } from "mobx-state-tree"

const UserProfileModel = types.model("UserProfile").props({
  avatar_id: types.maybeNull(types.string),
  birthday: types.maybeNull(types.string),
  city: types.maybeNull(types.string),
  cover_id: types.maybeNull(types.string),
  created_at: types.optional(types.string, ""),
  description: types.maybeNull(types.string),
  id: types.maybeNull(types.string),
  updated_at: types.optional(types.string, ""),
})

/**
 * Model description here for TypeScript hints.
 */
export const UserModel = types
  .model("User")
  .props({
    created_at: types.optional(types.string, ""),
    email: types.optional(types.string, ""),
    first_name: types.optional(types.string, ""),
    id: types.optional(types.string, ""),
    last_name: types.optional(types.string, ""),
    nick_name: types.maybeNull(types.string),
    updated_at: types.optional(types.string, ""),
    // @ts-ignore
    profile: types.optional(UserProfileModel, {}),
  })
  .actions((self: any)  => ({
    updateUser(user: any): void {
      // tslint:disable-next-line: no-parameter-reassignment
      self = user
    },
    updateNickName(nick_name: string): void {
      self.nick_name = nick_name
    }
  }))

type UserModelType = Instance<typeof UserModel>
export interface IUserModel extends UserModelType {}
type UserProfileSnapshotType = SnapshotOut<typeof UserModel>
export interface IUserModelSnapshot extends UserProfileSnapshotType {}
