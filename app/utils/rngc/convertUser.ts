import { IUser } from "@services/api"

export function convertUserToRNGCFormat(user: IUser, avatarUrl: string) {
  return {
    _id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    avatar: avatarUrl
  }
}
