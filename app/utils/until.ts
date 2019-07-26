import { IBoolFunction } from "@types"

async function sleep(ms: number): Promise<Function> {
  return new Promise((resolve: Function): number => {
    return setTimeout(resolve, ms)
  })
}

// tslint:disable-next-line: no-inferrable-types
export async function until(fn: IBoolFunction, ms: number = 0): Promise<void> {
  while (!fn()) {
    await sleep(ms)
  }
}
