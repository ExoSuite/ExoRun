import { GroupsModel, IGroupsModel } from "@models/groups"
import { GroupsModelMockData } from "../../__mocks__/stores/GroupsModelMock"
import { MobxStateTreeEnvMock } from "../../__mocks__/stores/MobxStateTreeEnvMock"

describe("groups model", () => {
  test("can be created", () => {
    const instance: IGroupsModel = GroupsModel.create(GroupsModelMockData, MobxStateTreeEnvMock)

    expect(instance).toBeTruthy()
  })

})
