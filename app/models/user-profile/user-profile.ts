import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { IUser } from "@services/api"

const UserProfileModel = types.model("UserProfile").props({
  avatar_id: types.maybeNull(types.string),
  birthday: types.maybeNull(types.string),
  city: types.maybeNull(types.string),
  cover_id: types.maybeNull(types.string),
  created_at: types.optional(types.string, ""),
  description: types.maybeNull(types.string),
  id: types.maybeNull(types.string),
  updated_at: types.optional(types.string, "")
})

export const UserModel = types
  .model("User")
  .props({
    created_at: types.optional(types.string, ""),
    email: types.optional(types.string, ""),
    first_name: types.optional(types.string, ""),
    id: types.optional(types.string, ""),
    last_name: types.optional(types.string, ""),
    nick_name: types.optional(types.string, ""),
    updated_at: types.optional(types.string, ""),
    profile: types.optional(UserProfileModel, {})
  })
  .actions((self: any) => ({
    updateUserField(field: string, value: string): void {
      self[field] = value
    }
  }))

export function updateUserModel(newUser: IUser, userModel: IUserModel): void {
  Object.entries(newUser).forEach(
    ([key, value]: [string, string]): void => {
      userModel.updateUserField(key, value || "")
    }
  )
}

type UserModelType = Instance<typeof UserModel>

// tslint:disable-next-line:no-empty-interface
export interface IUserModel extends UserModelType {
}

type UserProfileSnapshotType = SnapshotOut<typeof UserModel>

// tslint:disable-next-line:no-empty-interface
export interface IUserModelSnapshot extends UserProfileSnapshotType {
}
