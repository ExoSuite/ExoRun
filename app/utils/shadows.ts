import { Platform } from "react-native"

export const footerShadow = Platform.select({
  android: {
    elevation: 2
  },
  ios: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.4,
    shadowRadius: 4.65
  },
  default: {}
})

export const headerShadow = Platform.select({
  android: {
    elevation: 3
  },
  ios: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65
  },
  default: {}
})
