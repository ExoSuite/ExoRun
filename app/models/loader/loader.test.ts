import { LoaderModel, Loader } from "./loader"

test("can be created", () => {
  const instance: Loader = LoaderModel.create({})

  expect(instance).toBeTruthy()
})