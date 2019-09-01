import { IUser } from "@services/api"
import { User as RNGCUser } from "react-native-gifted-chat"

export function convertUserToRNGCFormat(user: IUser, avatarUrl: string): RNGCUser {
  return {
    _id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    avatar: avatarUrl
  }
}
