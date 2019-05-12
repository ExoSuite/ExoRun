import { UserModel } from "@models/user-profile"

function randomString(): string {
  // tslint:disable-next-line: insecure-random
  return Math.random().toString(36).substr(2, 5);
}

export const UserModelMockData = {
  created_at: randomString(),
  email: randomString(),
  first_name: randomString(),
  id: randomString(),
  last_name: randomString(),
  profile: { created_at: randomString(), id: randomString(), updated_at: randomString() },
  updated_at: randomString(),
  nick_name: randomString()
}

export const UserModelMock =  UserModel.create(UserModelMockData)
