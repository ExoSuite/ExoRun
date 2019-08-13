// vendor imports
import { Button } from "@components/button"
import { Text } from "@components/text"
import { FinalAnimationStatus, IAnimation, LoaderState } from "@components/data-loader/data-loader.types"
import { FormRow } from "@components/form-row"
import autobind from "autobind-decorator"
import { isEmpty } from "lodash-es"
import AnimatedLottieView from "lottie-react-native"
import { action, observable, runInAction } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { View, ViewStyle } from "react-native"
import { View as AnimatedView } from "react-native-animatable"
import Modal from "react-native-modal"
// custom imports
import { Lottie } from "@services/lottie"
import { color } from "@theme"
import { Platform } from "@services/device"
import { HttpRequestError } from "@exceptions"
import { IDataLoaderProps } from "./data-loader.props"

const MODAL_CONTAINER: ViewStyle = {
  padding: 22,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  minHeight: 225,
  backgroundColor: color.palette.backgroundDarkerer
}

const baseAnimation: IAnimation = {
  start: 0,
  end: 120
}

const successAnimation: IAnimation = {
  start: 240,
  end: 417
}

const errorAnimation: IAnimation = {
  start: 658,
  end: 822
}

const ALIGN_CENTER: ViewStyle = {
  alignItems: "center"
}

const LOADER_STYLE: ViewStyle = {
  width: 200
}

const LOADER_CONTAINER_STYLE: ViewStyle = {
  width: 125,
  height: 125
}

const DEFAULT_CONTAINER_TEXT_STYLE: ViewStyle = {
  maxHeight: 0,
  opacity: 0
}

const CONTAINER_TEXT_STYLE: ViewStyle = {
  maxHeight: 500,
  opacity: 1
}

type CallbackType = () => void
export const defaultSuccessCallback: CallbackType = (): void => {
  console.tron.log("success callback from animated loader called!")
}
export const defaultErrorCallback: CallbackType = (): void => {
  console.tron.log("error callback from animated loader called!")
}
export const defaultSoundCallback: CallbackType = (): void => {
  console.tron.log("sound callback from animated loader called!")
}

const baseDelayedIOS = 1100
const baseDelayedAndroid = 1100
const delayedAction = (callback: Function): void => {
  setTimeout(() => {
    callback()
    // tslint:disable-next-line: no-use-before-declare
  }, DataLoader.getDelayedTime)
}

/**
 * Loader with lottie animation on error or success
 *
 * Component description here for TypeScript tips.
 */
@observer
export class DataLoader extends React.Component<IDataLoaderProps> {

  public static get Instance(): DataLoader {
    return DataLoader._Instance
  }

  public static set Instance(value: DataLoader) {
    DataLoader._Instance = value
  }

  private animatedTextView: AnimatedView
  // optional failure callback
  private errorCallback: CallbackType = defaultErrorCallback
  // will be displayed on error animation has finished
  @observable private errors: object = {}
  private finalAnimationStatus: FinalAnimationStatus
  @observable private isVisible: boolean
  // will be fill on the LottieView was mounted take a look to <AnimatedLottieView ref/>
  private lottieAnimation: AnimatedLottieView
  // optional sound callback
  private soundCallback: CallbackType = defaultSoundCallback
  // initialize the state to standby
  private status: LoaderState = LoaderState.STANDBY
  // optional success callback
  private successCallback: CallbackType = defaultSuccessCallback

  /* tslint:disable: variable-name */
  private static _Instance: DataLoader = null

  public static get getDelayedTime(): number {
    return Platform.iOS ? baseDelayedIOS : baseDelayedAndroid
  }

  private baseAnimation(): void {
    const { start, end } = baseAnimation
    this.lottieAnimation.play(start, end)
  }

  private errorAnimation(): void {
    const { start, end } = errorAnimation
    this.lottieAnimation.play(start, end)
  }

  @autobind
  private Errors(): React.ReactElement {

    return (
      <View style={ALIGN_CENTER}>
        <FormRow preset="clear">
          {
            Object.keys(this.errors)
              .map((key: string) => {
                const value = this.errors[key][0]

                return <Text preset="centeredBold" text={value} {...{ key }}/>
              })
          }
        </FormRow>
        <FormRow preset="clear">
          <Button
            preset="success"
            onPress={this.toggleIsVisible}
            style={LOADER_STYLE}
          >
            <Text preset="bold" tx="common.back"/>
          </Button>
        </FormRow>
      </View>
    )
  }

  private hasError(): boolean {
    return this.status === LoaderState.ERROR
  }

  private isStandingBy(): boolean {
    return this.status === LoaderState.STANDBY
  }

  private isSuccessFul(): boolean {
    return this.status === LoaderState.SUCCESS
  }

  // handle all the logic of the animations
  @autobind
  private onAnimationFinish(): void {

    // 2nd step when error or success animation has finished cross or a check
    // ⚠️ THIS PART WILL ONLY RUN ON ANDROID ⚠️
    if (this.finalAnimationStatus === FinalAnimationStatus.PLAYED) {
      this.finalAnimationStep()
    } else if (this.finalAnimationStatus === FinalAnimationStatus.WILL_PLAY) {
      // on android call the sound animation and success animation after first step
      if (Platform.Android) {
        this.firstAnimationStep()
        this.finalAnimationStatus = FinalAnimationStatus.PLAYED
      } else { // on ios call the final step
        this.finalAnimationStep()
        this.finalAnimationStatus = FinalAnimationStatus.STOPPED
      }
    } else if (this.isSuccessFul()) {
      this.successAnimation()
      this.finalAnimationStatus = FinalAnimationStatus.WILL_PLAY
      // on ios call the sound animation and success animation beforehand
      if (Platform.iOS) {
        this.firstAnimationStep()
      }
    } else if (this.hasError()) {
      this.errorAnimation()
      this.finalAnimationStatus = FinalAnimationStatus.WILL_PLAY
      // on ios call the sound animation and success beforehand
      if (Platform.iOS) {
        this.firstAnimationStep()
      }
    } else if (this.isStandingBy()) {
      this.baseAnimation()
    }
  }

  private playSoundCallback(): void {
    this.soundCallback()
  }

  @autobind
  private setAnimatedTextViewRef(ref: any): void {
    this.animatedTextView = ref
  }

  @autobind
  private setLottieAnimationRef(ref: AnimatedLottieView): void {
    this.lottieAnimation = ref
  }

  private successAnimation(): void {
    const { start, end } = successAnimation
    this.lottieAnimation.play(start, end)
  }

  public componentDidUpdate(prevProps: Readonly<IDataLoaderProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this.isVisible && this.lottieAnimation && this.status !== LoaderState.STOP) {
      this.baseAnimation()
    }
  }

  public finalAnimationStep(): void {
    if (this.isSuccessFul()) {
      runInAction(() => this.isVisible = false)
    } else {
      this.errorCallback()
    }
    this.status = LoaderState.STOP
    this.finalAnimationStatus = FinalAnimationStatus.STOPPED
  }

  public firstAnimationStep(): void {
    if (this.isSuccessFul()) {
      delayedAction(() => {
        this.playSoundCallback()
      })
    } else {
      delayedAction(() => {
        this.playSoundCallback()
        this.animatedTextView.transition(DEFAULT_CONTAINER_TEXT_STYLE, CONTAINER_TEXT_STYLE)
      })
    }
  }

  /*
  * call this method when you want to display the error modal
  * errors must be as the same form as
  * https://confluence.dev.exosuite.fr/display/APIDoc/Routes+documentation#/Auth/loginUser
  * see 422 section
  * example :
  *  {
  *   "email": [
  *      "The email field Is required."
  *    ],
  *    "password": [
  *      "The password field Is required."
  *    ]
  *  }
  */
  @action
  public hasErrors(
    errors: object | HttpRequestError,
    soundCallback?: CallbackType,
    errorCallback?: CallbackType
  ): void {
    this.status = LoaderState.ERROR
    this.isVisible = true

    this.errors = errors instanceof HttpRequestError ? errors.formattedErrors() : errors

    this.errorCallback = errorCallback || this.errorCallback
    this.soundCallback = soundCallback || this.soundCallback
  }

  public render(): React.ReactNode {
    // grab the props
    const { children } = this.props
    const { isVisible, onAnimationFinish, Errors, setLottieAnimationRef, setAnimatedTextViewRef } = this

    return (
      <Modal
        isVisible={isVisible}
        onModalHide={this.successCallback}
        useNativeDriver
      >
        <View style={MODAL_CONTAINER}>
          <FormRow preset="clear" style={LOADER_CONTAINER_STYLE}>
            <AnimatedLottieView
              ref={setLottieAnimationRef}
              source={Lottie.LoaderSuccessFailed}
              loop={false}
              speed={1.25}
              resizeMode="cover"
              onAnimationFinish={onAnimationFinish}
            />
          </FormRow>
          {!isEmpty(this.errors) && (
            <AnimatedView
              ref={setAnimatedTextViewRef}
              style={DEFAULT_CONTAINER_TEXT_STYLE}
            >
              <Errors/>
            </AnimatedView>
          )}

          {children}
        </View>
      </Modal>
    )
  }

  // call this method when you want to display the success modal
  @action
  public success(soundCallback?: CallbackType, successCallback?: CallbackType): void {
    this.status = LoaderState.SUCCESS
    this.successCallback = successCallback || this.successCallback
    this.soundCallback = soundCallback || this.soundCallback
  }

  @action.bound
  public toggleIsVisible(): DataLoader {
    this.isVisible = !this.isVisible
    this.errors = {}
    this.status = LoaderState.STANDBY
    this.finalAnimationStatus = FinalAnimationStatus.STANDING_BY

    return this
  }

}
