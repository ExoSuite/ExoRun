// define loaderState
export enum LoaderState {
  ERROR,
  SUCCESS,
  STANDBY,
}

export interface Animation {
  start: number,
  end: number
}
