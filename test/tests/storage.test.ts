/**
 * @jest-environment node
 */

import { clear, load, loadString, remove, save, saveString } from "@utils/storage"
import {
  mockClear,
  mockRemoveItem,
  mockSetItem,
  VALUE_OBJECT,
  VALUE_STRING
} from "../__mocks__/@react-native-community/async-storage/"

// reset mocks after each test
afterEach(() => jest.clearAllMocks())

test("load", async () => {
  const value = await load("something")
  expect(value).toEqual(JSON.parse(VALUE_STRING))
})

test("loadString", async () => {
  const value = await loadString("something")
  expect(value).toEqual(VALUE_STRING)
})

test("save", async () => {
  await save("something", VALUE_OBJECT)
  expect(mockSetItem).toHaveBeenCalledWith("something", VALUE_STRING)
})

test("saveString", async () => {
  await saveString("something", VALUE_STRING)
  expect(mockSetItem).toHaveBeenCalledWith("something", VALUE_STRING)
})

test("remove", async () => {
  await remove("something")
  expect(mockRemoveItem).toHaveBeenCalledWith("something")
})

test("clear", async () => {
  await clear()
  expect(mockClear).toHaveBeenCalledWith()
})
