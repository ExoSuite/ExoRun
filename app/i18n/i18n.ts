import RNLanguages from "react-native-languages"
import I18n from "i18n-js"


const en = require("./en")
const fr = require("./fr")

I18n.locale = RNLanguages.language
I18n.fallbacks = true
I18n.translations = { en, fr }
