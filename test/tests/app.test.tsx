import React from "react"
import renderer, { ReactTestRenderer } from "react-test-renderer"
import { App } from "../../app/app"
import { View } from "react-native"

function ModalMock(props: { children: React.ReactNode }): React.ReactNode {
  return (
    <View>
      {props.children}
    </View>
  )
}

test("App match snapshot", () => {

  jest.mock("react-native-modal", () => ModalMock);

  const app: ReactTestRenderer = renderer.create(
    <App />
  );

  // @ts-ignore
  app.root.instance.setState({
    env: {
      api: {},
      soundPlayer: {}
    },
    rootStore: {
      navigationStore: {
        actionSubscribers: (): {} => ({}),
        findCurrentRoute: (): {routeName: string} => ({routeName: ""})
      }
    }
  })

  const json = app.toJSON()
  expect(json).toMatchSnapshot();
});
