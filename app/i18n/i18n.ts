import * as RNLocalize from "react-native-localize"
import I18n from "i18n-js"


const en = require("./en")
const fr = require("./fr")

I18n.fallbacks = true
I18n.translations = { en, fr }

const fallback = { languageTag: "en", isRTL: false }
const { languageTag } = RNLocalize.findBestAvailableLanguage(Object.keys(I18n.translations)) || fallback

I18n.locale = languageTag

export {
  languageTag
}
