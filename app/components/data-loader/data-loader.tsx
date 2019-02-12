// vendor imports
import * as React from "react"
import { View, ViewStyle } from "react-native"
import Modal from "react-native-modal"
import AnimatedLottieView from "lottie-react-native"
import isEmpty from "lodash.isempty"
import { action, observable, runInAction } from "mobx"
import autobind from "autobind-decorator"
import { observer } from "mobx-react/native"
import { View as AnimatedView } from "react-native-animatable"
// custom imports
import { Lottie } from "@services/lottie"
import { Animation, FinalAnimationStatus, LoaderState } from "@components/data-loader/data-loader.types"
import { DataLoaderProps } from "./data-loader.props"
import { Button, Text } from "@components"
import { FormRow } from "@components/form-row"
import { color } from "@theme"
import { HttpRequestError } from "@exceptions"
import { Platform } from "@services/device"


const MODAL_CONTAINER: ViewStyle = {
  padding: 22,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  minHeight: 225,
  backgroundColor: color.palette.backgroundDarkerer,
}

const baseAnimation: Animation = {
  start: 0,
  end: 120,
}

const successAnimation: Animation = {
  start: 240,
  end: 417,
}

const errorAnimation: Animation = {
  start: 658,
  end: 822,
}

const ALIGN_CENTER: ViewStyle = {
  alignItems: "center",
}

const LOADER_STYLE: ViewStyle = {
  width: 200,
}

const LOADER_CONTAINER_STYLE: ViewStyle = {
  width: 125,
  height: 125,
}

const DEFAULT_CONTAINER_TEXT_STYLE: ViewStyle = {
  maxHeight: 0,
  opacity: 0,
}

const CONTAINER_TEXT_STYLE: ViewStyle = {
  maxHeight: 500,
  opacity: 1,
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

const baseDelayedIOS: number = 550
const baseDelayedAndroid: number = 1100


/**
 * Loader with lottie animation on error or success
 *
 * Component description here for TypeScript tips.
 */
@observer
export class DataLoader extends React.Component<DataLoaderProps> {

  @observable private _isVisible: boolean = false

  // will be displayed on error animation has finished
  @observable private _errors: Object

  private _finalAnimationStatus: FinalAnimationStatus

  // initialize the state to standby
  private _status: LoaderState = LoaderState.STANDBY

  // will be fill on the LottieView was mounted take a look to <AnimatedLottieView ref/>
  private _lottieAnimation: AnimatedLottieView

  // optional success callback
  private _successCallback: CallbackType = defaultSuccessCallback

  // optional failure callback
  private _errorCallback: CallbackType = defaultErrorCallback

  //optional sound callback
  private _soundCallback: CallbackType = defaultSoundCallback

  private _animatedTextView: AnimatedView

  private static _instance: DataLoader = null

  static get instance(): DataLoader {
    return this._instance
  }

  static set instance(value: DataLoader) {
    this._instance = value
  }


  /*
  * call this method when you want to display the error modal
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
  hasErrors(errors: Object | HttpRequestError, soundCallback?: CallbackType, errorCallback?: CallbackType) {
    this._status = LoaderState.ERROR

    if (errors instanceof HttpRequestError) {
        this._errors = errors.formattedErrors()
    } else {
      this._errors = errors
    }

    this._errorCallback = errorCallback || this._errorCallback
    this._soundCallback = soundCallback || this._soundCallback
  }

  // call this method when you want to display the success modal
  @action
  success(soundCallback?: CallbackType, successCallback?: CallbackType) {
    this._status = LoaderState.SUCCESS
    this._successCallback = successCallback || this._successCallback
    this._soundCallback = soundCallback || this._soundCallback
  }

  componentDidUpdate(prevProps: Readonly<DataLoaderProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this._isVisible && this._lottieAnimation && this._status !== LoaderState.STOP) {
      this.baseAnimation()
    }
  }

  private baseAnimation() {
    const { start, end } = baseAnimation
    this._lottieAnimation.play(start, end)
  }

  private successAnimation() {
    const { start, end } = successAnimation
    this._lottieAnimation.reset()
    this._lottieAnimation.play(start, end)
  }

  private errorAnimation() {
    const { start, end } = errorAnimation
    this._lottieAnimation.reset()
    this._lottieAnimation.play(start, end)
  }

  @action.bound
  toggleIsVisible(): this {
    this._isVisible = !this._isVisible
    this._errors = {}
    this._status = LoaderState.STANDBY
    this._finalAnimationStatus = FinalAnimationStatus.STANDING_BY
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

  private static getDelayedTime() {
    return Platform.iOS ? baseDelayedIOS : baseDelayedAndroid
  }

  private soundCallback() {
    if (Platform.iOS)
      setTimeout(this._soundCallback, DataLoader.getDelayedTime())
    else
      this._soundCallback()
  }

  private delayedAction(callback: Function) {
    setTimeout(() => {
      callback()
    }, DataLoader.getDelayedTime())
  }

  finalAnimationStep() {
    if (this.isSuccessFul()) {
      runInAction(() => this._isVisible = false)
      this._successCallback()
    } else {
      this._errorCallback()
    }
    this._status = LoaderState.STOP
    this._finalAnimationStatus = FinalAnimationStatus.STOPPED
  }

  firstAnimationStep() {
    if (this.isSuccessFul()) {
      this.delayedAction(() => {
        this.soundCallback()
      })
    } else {
      this.delayedAction(() => {
        this.soundCallback()
        this._animatedTextView.transition(DEFAULT_CONTAINER_TEXT_STYLE, CONTAINER_TEXT_STYLE)
      })
    }
  }

  // handle all the logic of the animations
  @autobind
  private onAnimationFinish() {

    // 2nd step when error or success animation has finished cross or a check
    // ⚠️ THIS PART WILL ONLY RUN ON ANDROID ⚠️
    if (this._finalAnimationStatus === FinalAnimationStatus.PLAYED) {
      this.finalAnimationStep()
    }

    // ⚠️ after first loop animation ⚠️
    else if (this._finalAnimationStatus === FinalAnimationStatus.WILL_PLAY) {
      // on android call the sound animation and success animation after first step
      if (Platform.Android) {
        this.firstAnimationStep()
        this._finalAnimationStatus = FinalAnimationStatus.PLAYED
      } else { // on ios call the final step
        this.finalAnimationStep()
        this._finalAnimationStatus = FinalAnimationStatus.STOPPED
      }
    }
    // display the success animation
    else if (this.isSuccessFul()) {
      this.successAnimation()
      this._finalAnimationStatus = FinalAnimationStatus.WILL_PLAY
      // on ios call the sound animation and success animation beforehand
      if (Platform.iOS)
        this.firstAnimationStep()
    }
    //display the error animation
    else if (this.hasError()) {
      this.errorAnimation()
      this._finalAnimationStatus = FinalAnimationStatus.WILL_PLAY
      // on ios call the sound animation and success beforehand
      if (Platform.iOS)
        this.firstAnimationStep()
    }
    // continue to loop on base animation
    else if (this.isStandingBy()) {
      this.baseAnimation()
    }
  }

  @autobind
  Errors() {
    const formattedErrors = []
    Object.keys(this._errors)
      .forEach((key) => {
        formattedErrors.push({ key, value: this._errors[key][0] })
      })

    return (
      <View style={ALIGN_CENTER}>
        <FormRow preset="clear">
          {
            formattedErrors.map(({ key, value }) => {
              return <Text preset="centeredBold" text={value} {...{ key }}/>
            })
          }
        </FormRow>
        <FormRow preset="clear">
          <Button
            preset="success"
            tx="auth.back"
            onPress={this.toggleIsVisible}
            style={LOADER_STYLE}
          >
            <Text preset="bold" tx="auth.back"/>
          </Button>
        </FormRow>
      </View>
    )
  }

  render(): React.ReactNode {
    // grab the props
    const { children } = this.props
    const { _isVisible, onAnimationFinish, Errors } = this

    return (
      <Modal
        isVisible={_isVisible}
      >
        <View style={MODAL_CONTAINER}>
          <FormRow preset="clear" style={LOADER_CONTAINER_STYLE}>
            <AnimatedLottieView
              ref={(ref) => this._lottieAnimation = ref}
              source={Lottie.LoaderSuccessFailed}
              loop={false}
              speed={1.25}
              resizeMode={"cover"}
              onAnimationFinish={onAnimationFinish}
            />
          </FormRow>
          {!isEmpty(this._errors) && (
            <AnimatedView
              ref={(ref) => {
                // @ts-ignore
                this._animatedTextView = ref
              }}
              style={DEFAULT_CONTAINER_TEXT_STYLE}>
              <Errors/>
            </AnimatedView>
          )}

          {children}
        </View>
      </Modal>
    )
  }

}
