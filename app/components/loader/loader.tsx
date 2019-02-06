// vendor imports
import * as React from "react"
import { View, ViewStyle } from "react-native"
import Modal from "react-native-modal"
import AnimatedLottieView from "lottie-react-native"
import isEmpty from "lodash.isempty"
import { action, observable } from "mobx"
import autobind from "autobind-decorator"
import { observer } from "mobx-react/native"
import { View as AnimatedView } from "react-native-animatable"
import Sound from 'react-native-sound'

// custom imports
import { Lottie } from "@services/lottie"
import { Animation, LoaderState } from "@components/loader/loader.types"
import { LoaderProps } from "./loader.props"
import {SoundPlayer} from "@services/sound-player"


const MODAL_CONTAINER: ViewStyle = {
  backgroundColor: "white",
  padding: 22,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  minHeight: 200
}

const baseAnimation: Animation = {
  start: 0,
  end: 240
}

const successAnimation: Animation = {
  start: baseAnimation.start,
  end: 417
}

const errorAnimation: Animation = {
  start: 658,
  end: 824
}

type CallbackType = () => void
export const defaultSuccessCallback = () => {
  console.tron.log("success callback from animated loader called!")
}
export const defaultErrorCallback = () => {
  console.tron.log("error callback from animated loader called!")
}
export const defaultSoundCallback = () => {
  console.tron.log("sound callback from animated loader called!")
}

/**
 * Loader with lottie animation on error or success
 *
 * Component description here for TypeScript tips.
 */
@observer
export class Loader extends React.Component<LoaderProps> {

  @observable private _isVisible: boolean = false

  // will be displayed on error animation has finished
  @observable private _errors: Object

  // will be affected on hasErrors function
  private _tempErrors: Object

  private _isFinalAnimationPlaying: boolean = false

  // initialize the state to standby
  private _status: LoaderState = LoaderState.STANDBY

  // will be fill on the LottieView was mounted take a look to <AnimatedLottieView ref/>
  private _lottieAnimation: AnimatedLottieView

  // optional success callback
  private _successCallback: CallbackType = defaultSuccessCallback

  // optional failure callback
  private _errorCallback: CallbackType = defaultErrorCallback


  private _soundCallback: CallbackType = defaultSoundCallback

  private _animatedTextView


  /*
  * errors must be as the same form as
  * https://confluence.dev.exosuite.fr/display/APIDoc/Routes+documentation#/Auth/loginUser
  * see 422 section
  * example :
  *  {
  *   "email": [
  *      "The email field is required."
  *    ],
  *    "password": [
  *      "The password field is required."
  *    ]
  *  }
  */
  @action
  hasErrors(errors: Object, errorCallback?: CallbackType, soundCallback?: CallbackType) {
    this._status = LoaderState.ERROR
    this._isFinalAnimationPlaying = false
    this._errors = errors
    if (errorCallback)
      this._errorCallback = errorCallback;
    if (soundCallback)
      this._soundCallback = soundCallback
  }

  @action
  success(successCallback?: CallbackType, soundCallback?: CallbackType) {
    this._status = LoaderState.SUCCESS
    this._isFinalAnimationPlaying = false
    if (successCallback)
      this._successCallback = successCallback;
    if (soundCallback)
      this._soundCallback = soundCallback

  }

  componentDidUpdate(prevProps: Readonly<LoaderProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this._isVisible && this._lottieAnimation) {
      this.baseAnimation()
    }
  }

  private baseAnimation() {
    const { start, end } = baseAnimation
    this._lottieAnimation.play(start, end)
  }

  private successAnimation() {
    const { start, end } = successAnimation
    this._lottieAnimation.play(start, end)
  }

  private errorAnimation() {
    const { start, end } = errorAnimation
    this._lottieAnimation.play(start, end)
  }

  @action.bound
  toggleIsVisible(): this {
    this._isVisible = !this._isVisible
    this._errors = {}
    this._status = LoaderState.STANDBY
    this._isFinalAnimationPlaying = false
    return this
  }

  private isSuccessFul() {
    return this._status === LoaderState.SUCCESS
  }

  private isStandingBy() {
    return this._status === LoaderState.STANDBY
  }

  private hasError() {
    return this._status === LoaderState.ERROR
  }

  private soundCallback() {
    setTimeout(this._soundCallback, 1100)
  }

  // handle all the logic of the animations
  @autobind
  private onAnimationFinish() {
    // remove the success animation
    if (this._isFinalAnimationPlaying) {
      if (this.isSuccessFul()) {
        this._isVisible = false
        this._successCallback()
      } else {
        this._errorCallback()
      }
    }
    // display the success animation
    else if (this.isSuccessFul() && !this._isFinalAnimationPlaying) {
      this.successAnimation()
      this._isFinalAnimationPlaying = true
      this.soundCallback()
    }
    //display the error animation
    else if (this.hasError() && !this._isFinalAnimationPlaying) {
      this.errorAnimation()
      this._isFinalAnimationPlaying = true
      this.soundCallback()
    }
    // continue to loop on base animation
    else if (this.isStandingBy() && !this._isFinalAnimationPlaying) {
      this.baseAnimation()
    }
  }

  @autobind
  Errors() {
    const errors = []
    for (const error in this._errors) {
      if (!this._errors.hasOwnProperty(error)) continue
      console.tron.log(error)
    }

    return <View/>
  }

  render(): React.ReactNode {
    // grab the props
    const { style, children, ...rest } = this.props
    const { toggleIsVisible, _isVisible, onAnimationFinish, Errors } = this

    return (
      <Modal
        isVisible={_isVisible}
        onBackdropPress={toggleIsVisible}
      >
        <View style={MODAL_CONTAINER}>
          <AnimatedLottieView
            ref={(ref) => this._lottieAnimation = ref}
            source={Lottie.LoaderSuccessFailed}
            loop={false}
            speed={1.5}
            autoSize
            onAnimationFinish={onAnimationFinish}
          />
          <AnimatedView ref={(ref) => this._animatedTextView = ref} animation="fadeIn">
            {!isEmpty(this._errors) && (
              <Errors/>
            )}
          </AnimatedView>
          {children}
        </View>
      </Modal>
    )
  }

}
