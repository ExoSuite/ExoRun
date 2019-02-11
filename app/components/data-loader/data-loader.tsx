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
import { Animation, LoaderState } from "@components/data-loader/data-loader.types"
import { DataLoaderProps } from "./data-loader.props"
import { Button, Text } from "@components"
import { FormRow } from "@components/form-row"
import { color } from "@theme"
import { HttpRequestError } from "@exceptions"
import { HttpResponse } from "@services/api"
import { translate } from "@i18n"


const MODAL_CONTAINER: ViewStyle = {
  padding: 22,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  minHeight: 200,
  backgroundColor: color.palette.backgroundDarkerer,
}

const baseAnimation: Animation = {
  start: 0,
  end: 240,
}

const successAnimation: Animation = {
  start: baseAnimation.start,
  end: 417,
}

const errorAnimation: Animation = {
  start: 658,
  end: 824,
}

const ALIGN_CENTER: ViewStyle = {
  alignItems: "center",
}

const LOADER_STYLE: ViewStyle = {
  width: 200,
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

const baseDelayed: number = 1100

const baseError = {
  error: [],
}

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

  //optional sound callback
  private _soundCallback: CallbackType = defaultSoundCallback

  private _animatedTextView

  private static _instance: DataLoader = null

  static get instance(): DataLoader {
    return this._instance
  }

  static set instance(value: DataLoader) {
    this._instance = value
  }

  private static _getErrorFromHttpRequestError(httpRequestError: HttpRequestError): Object {
    let errors
    switch (httpRequestError.code()) {
      case HttpResponse.UNAUTHORIZED: {
        errors = baseError
        errors.error = [translate("errors.unauthorized")]
        break
      }
      case HttpResponse.UNPROCESSABLE_ENTITY: {
        errors = httpRequestError.happened()
        break
      }
      default: {
        errors = baseError
        errors.error = [translate("errors.unknown")]
        break
      }
    }
    return errors
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
    this._isFinalAnimationPlaying = false

    if (errors instanceof HttpRequestError) {
        this._tempErrors = DataLoader._getErrorFromHttpRequestError(errors)
    } else {
      this._tempErrors = errors
    }

    this._errorCallback = errorCallback || this._errorCallback
    this._soundCallback = soundCallback || this._soundCallback
  }

  // call this method when you want to display the success modal
  @action
  success(soundCallback?: CallbackType, successCallback?: CallbackType) {
    this._status = LoaderState.SUCCESS
    this._isFinalAnimationPlaying = false
    this._successCallback = successCallback || this._successCallback
    this._soundCallback = soundCallback || this._soundCallback
  }

  componentDidUpdate(prevProps: Readonly<DataLoaderProps>, prevState: Readonly<{}>, snapshot?: any): void {
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
    setTimeout(this._soundCallback, baseDelayed)
  }

  private delayedErrorDisplay() {

    setTimeout(() => runInAction(() => {
      this._errors = this._tempErrors
      this._animatedTextView.fadeIn()
    }), baseDelayed)
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
      this.delayedErrorDisplay()
    }
    // continue to loop on base animation
    else if (this.isStandingBy() && !this._isFinalAnimationPlaying) {
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
          <FormRow preset="clear">
            <AnimatedLottieView
              ref={(ref) => this._lottieAnimation = ref}
              source={Lottie.LoaderSuccessFailed}
              loop={false}
              speed={1.25}
              style={LOADER_STYLE}
              onAnimationFinish={onAnimationFinish}
            />
          </FormRow>
          <AnimatedView ref={(ref) => this._animatedTextView = ref}>
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
