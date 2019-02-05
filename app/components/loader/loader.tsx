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
  minHeight: 200
}


/**
 * Loader with lottie animation on error or success
 *
 * Component description here for TypeScript tips.
 */
@observer
export class Loader extends React.Component<LoaderProps> {

  private readonly animationEnd = 240
  private readonly animationStart = 0
  private readonly successAnimation = {
    start: this.animationStart,
    end: 417
  }

  @observable private _isVisible: boolean = false;
  private isAnimationPlaying = false

  lottieAnimation: LottieView;

  @action
  hasError(errors: Object): this {
    this._errors = errors;
    return this
  }

  success() {
    this.lottieAnimation.reset();
    this.lottieAnimation.play(this.successAnimation.start, this.successAnimation.end)
    this.isAnimationPlaying = false
  }

  componentDidUpdate(prevProps: Readonly<LoaderProps>, prevState: Readonly<{}>, snapshot?: any): void {
    const {animationEnd, animationStart} = this
    if (this._isVisible && this.lottieAnimation && !this.isAnimationPlaying) {
      this.lottieAnimation.play(animationStart, animationEnd)
      this.isAnimationPlaying = true
      /*this.lottieAnimation.reset();
      this.lottieAnimation.play(this.successAnimation.start, this.successAnimation.end)*/
    }
  }

  @action.bound
  toggleIsVisible(): this {
    this._isVisible = !this._isVisible
    return this
  }

  render(): React.ReactNode {
    // grab the props
    const { style, children, ...rest } = this.props
    const { toggleIsVisible, _isVisible } = this

    return (
      <Modal
        isVisible={_isVisible}
        onBackdropPress={toggleIsVisible}
      >
        <View style={MODAL_CONTAINER}>
          <LottieView
            ref={(ref) => this.lottieAnimation = ref}
            source={Lottie.LoaderSuccessFailed}
          />
          {children}
        </View>
      </Modal>
    )
  }

}
