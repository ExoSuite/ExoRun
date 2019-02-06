jest.mock("react-native-localize", () => {
  return {
    getLocales: () => ["fr", "en"],
    findBestAvailableLanguage: () => {
      return { languageTag: "en", isRTL: false }
    }
  }
})
