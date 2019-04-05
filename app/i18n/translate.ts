import I18n from "i18n-js"

type ITranslation = string | null

/**
 * Translates text.
 *
 * @param key The i18n key.
 */
export function translate(key: string): ITranslation {
  // tslint:disable-next-line
  return key ? I18n.t(key) : null
}

/**
 * Translates with variables.
 *
 * @param key The i18n key
 * @param vars Additional values sure to replace.
 */
export function translateWithVars(key: string, vars: object): ITranslation {
  // tslint:disable-next-line
  return key ? I18n.t(key, vars) : null
}
