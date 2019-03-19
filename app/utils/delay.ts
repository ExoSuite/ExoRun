/**
 * A "modern" sleep statement.
 *
 * @param ms The number of milliseconds to wait.
 */
export const delay = (ms: number): Promise<any> => new Promise((resolve: Function): void => {
  setTimeout(resolve, ms)
})
