// tslint:disable

jest.mock("TextInput", () => {
  const RealComponent = jest.requireActual("TextInput")
  const React = require("React")

  class TextInput extends React.Component {
    public render() {
      return React.createElement(
        "TextInput",
        { ...this.props, autoFocus: false },
        this.props.children
      )
    }
  }

  TextInput.propTypes = RealComponent.propTypes

  return TextInput
})
