import { IUserModel, UserModel } from "@models/user-profile"

describe("user profile model", () => {
  test("can be created", () => {
    const instance: IUserModel = UserModel.create()

    expect(instance).toBeTruthy()
  })
})
