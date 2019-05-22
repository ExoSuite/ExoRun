import { GroupsModel, IGroupsModel } from "@models/groups"
import { GroupsModelMockData } from "../../__mocks__/stores/GroupsModelMock"

describe("groups model", () => {
  test("can be created", () => {
    const instance: IGroupsModel = GroupsModel.create(GroupsModelMockData)

    expect(instance).toBeTruthy()
  })

})
