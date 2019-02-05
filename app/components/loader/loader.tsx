import * as React from "react"
import { View, ViewStyle } from "react-native"
import Modal from "react-native-modal"
import { LoaderProps } from "./loader.props"
import { observer } from "mobx-react/native"
import { action, observable } from "mobx"
import { Text } from "../text"


const MODAL_CONTAINER: ViewStyle = {
  backgroundColor: "white",
  padding: 22,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
}

interface LoaderState {
  is
}

/**
 * Loader with lottie animation on error or success
 *
 * Component description here for TypeScript tips.
 */
@observer
export class Loader extends React.Component<LoaderProps, LoaderState> {

  @observable private _isVisible: boolean = false;

  @action
  hasError(errors: Object){
    this._errors = errors;
  }

  @action.bound
  toggleIsVisible() {
    this._isVisible = !this._isVisible
  }

  render(): React.ReactNode {
    // grab the props
    const { style, ...rest } = this.props
    const { toggleIsVisible, _isVisible } = this

    return (
      <Modal
        isVisible={_isVisible}
        onBackdropPress={toggleIsVisible}
      >
        <View style={MODAL_CONTAINER}>
          <Text text={"ok"}/>
        </View>
      </Modal>
    )
  }

}
