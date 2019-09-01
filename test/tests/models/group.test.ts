import { IGroup, GroupModel } from "@models/group"
import { GroupModelMockData } from "../../__mocks__/stores/GroupModelMock"
import { MobxStateTreeEnvMock } from "../../__mocks__/stores/MobxStateTreeEnvMock"

describe("group model", () => {

  test("can be created", () => {
    const instance: IGroup = GroupModel.create(GroupModelMockData, MobxStateTreeEnvMock)

    expect(instance).toBeTruthy()
  })
})
