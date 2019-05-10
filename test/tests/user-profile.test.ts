import { IUserModel, updateUserModel, UserModel } from "@models/user-profile"
import { IUser } from "@services/api"

function randomString(): string {
  // tslint:disable-next-line: insecure-random
  return Math.random().toString(36).substr(2, 5);
}

describe("user profile model", () => {
  test("can be created", () => {
    const instance: IUserModel = UserModel.create()

    expect(instance).toBeTruthy()
  })

  test("can be updated", () => {
    const instance: IUserModel = UserModel.create()
    expect(instance.nick_name).toContain("")
    const updatedUser: IUser = {
      created_at: randomString(),
      email: randomString(),
      first_name: randomString(),
      id: randomString(),
      last_name: randomString(),
      profile: { created_at: randomString(), id: randomString(), updated_at: randomString() },
      updated_at: randomString(),
      nick_name: randomString()
    }
    updateUserModel(updatedUser, instance)
    Object.entries(updatedUser).forEach(
      ([key, value]: [string, string]) => {
        if (key === "profile") {
          Object.entries(updatedUser[key]).forEach(
            ([profileKey, profileValue]: [string, string]) => {
              expect(updatedUser[key][profileKey]).toEqual(profileValue)
            }
          )
        } else {
          expect(instance[key]).toEqual(value)
        }
      }
    );
  })
})
