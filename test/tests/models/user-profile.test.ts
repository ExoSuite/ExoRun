import { IUserModel, updateUserModel, UserModel } from "@models/user-profile"
import { IUser } from "@services/api"
import { UserModelMockData } from "../../__mocks__/stores/UserModelMock"

describe("user profile model", () => {
  test("can be created", () => {
    const instance: IUserModel = UserModel.create()

    expect(instance).toBeTruthy()
  })

  test("can be updated", () => {
    const instance: IUserModel = UserModel.create()
    expect(instance.nick_name).toContain("")
    const updatedUser: IUser = UserModelMockData
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
