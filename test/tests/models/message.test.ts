import { IMessageModel, MessageModel } from "@models/message"
import { MessageModelMock } from "../../__mocks__/stores/MessageModelMock"

describe("message model", () => {
  test("can be created", () => {
    const instance: IMessageModel = MessageModel.create(MessageModelMock)

    expect(instance).toBeTruthy()
  })

})
