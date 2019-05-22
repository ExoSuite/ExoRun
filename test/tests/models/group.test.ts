import { Group, GroupModel } from "@models/group"
import { GroupModelMockData } from "../../__mocks__/stores/GroupModelMock"

describe("group model", () => {

  test("can be created", () => {
    const instance: Group = GroupModel.create(GroupModelMockData)

    expect(instance).toBeTruthy()
  })
})
