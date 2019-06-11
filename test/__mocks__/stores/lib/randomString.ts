export function randomString(): string {
  // tslint:disable-next-line: insecure-random
  return Math.random().toString(36).substr(2, 5);
}
