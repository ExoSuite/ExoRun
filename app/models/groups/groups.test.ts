import { GroupsModel, Groups } from "./groups"

test("can be created", () => {
  const instance: Groups = GroupsModel.create({})

  expect(instance).toBeTruthy()
})