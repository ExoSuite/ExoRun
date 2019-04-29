const noop = (): void => null;

const tron = {
  configure: noop,
  connect: noop,
  use: noop,
  useReactNative: noop,
  clear: noop,
  log: noop,
  logImportant: noop,
  display: noop,
  error: noop,
  image: noop,
  reportError: noop
}

// @ts-ignore
console.tron = tron
