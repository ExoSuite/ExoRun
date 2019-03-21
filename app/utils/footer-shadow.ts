import { Platform as RNPlatform } from "react-native"

export const footerShadow = RNPlatform.select({
  android: {
    elevation: 2,
  },
  ios: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4.65,
  },
  default: {},
});
