import { GroupModel, Group } from "./group"

test("can be created", () => {
  const instance: Group = GroupModel.create({})

  expect(instance).toBeTruthy()
})