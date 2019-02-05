import * as React from "react"
import { View, ViewStyle } from "react-native"
import Modal from "react-native-modal"
import { LoaderProps } from "./loader.props"
import { observer } from "mobx-react/native"
import { action, observable } from "mobx"
import LottieView from 'lottie-react-native';
import { Lottie } from "@services/lottie"


const MODAL_CONTAINER: ViewStyle = {
  backgroundColor: "white",
  padding: 22,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
}


/**
 * Loader with lottie animation on error or success
 *
 * Component description here for TypeScript tips.
 */
@observer
export class Loader extends React.Component<LoaderProps> {

  @observable private _isVisible: boolean = false;

  @action
  hasError(errors: Object): this {
    this._errors = errors;
    return this
  }

  @action.bound
  toggleIsVisible(): this {
    this._isVisible = !this._isVisible
    return this
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
          <LottieView
            source={Lottie.LoaderSuccessFailed}
            autoPlay
            loop
          />
        </View>
      </Modal>
    )
  }

}
