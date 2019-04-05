// define loaderState
export enum LoaderState {
  ERROR,
  SUCCESS,
  STANDBY,
  STOP,
}

export interface IAnimation {
  end: number
  start: number,
}

export enum FinalAnimationStatus {
  WILL_PLAY,
  PLAYED,
  STOPPED,
  STANDING_BY,
}
