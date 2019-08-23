import { SortFields } from "@utils/sort-fields"
import { IUserRun } from "@services/api"
import { SortValues } from "@utils/sort-values"

// tslint:disable-next-line:typedef
export const ascentValue = (field: SortFields) => (prev: IUserRun, next: IUserRun) => {
  if (prev[field] > next[field]) {
    return SortValues.DECAY
  }
  if (prev[field] < next[field]) {
    return SortValues.ASCENT
  }

  return SortValues.NONE
}

// tslint:disable-next-line:typedef
export const decayValue = (field: SortFields) => (prev: IUserRun, next: IUserRun) => {
  if (prev[field] < next[field]) {
    return SortValues.DECAY
  }
  if (prev[field] > next[field]) {
    return SortValues.ASCENT
  }

  return SortValues.NONE
}
