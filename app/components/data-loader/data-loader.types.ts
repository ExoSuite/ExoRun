// define loaderState
export enum LoaderState {
  ERROR,
  SUCCESS,
  STANDBY,
  STOP,
}

export interface Animation {
  start: number,
  end: number
}

export enum FinalAnimationStatus {
  WILL_PLAY,
  PLAYED,
  STOPPED,
  STANDING_BY,
}
