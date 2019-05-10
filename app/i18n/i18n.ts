import I18n from "i18n-js"
import * as RNLocalize from "react-native-localize"
import moment from "moment"
import "moment/min/locales.min"

const en = require("./en")
const fr = require("./fr")

I18n.fallbacks = true
I18n.translations = { en, fr }

const fallback = { languageTag: "en", isRTL: false }
const { languageTag } = RNLocalize.findBestAvailableLanguage(Object.keys(I18n.translations)) || fallback

I18n.locale = languageTag
moment.locale(languageTag)

export {
  languageTag
}
