import { color, spacing } from "@theme"
import { TextStyle, ViewStyle } from "react-native"

/**
 * All text will start off looking like this.
 */
const BASE_VIEW: ViewStyle = {
  alignItems: "center",
  borderRadius: 4,
  justifyContent: "center",
  paddingHorizontal: spacing[2],
  paddingVertical: spacing[2]
}

const BASE_TEXT: TextStyle = {
  paddingHorizontal: spacing[3]
}

/**
 * All the variations of text styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const viewPresets = {
  /**
   * A smaller piece of secondard information.
   */
  primary: { ...BASE_VIEW, backgroundColor: color.palette.blue } as ViewStyle,

  secondary: { ...BASE_VIEW, backgroundColor: color.secondary } as ViewStyle,

  success: { ...BASE_VIEW, backgroundColor: color.success } as ViewStyle,

  error: { ...BASE_VIEW, backgroundColor: color.error } as ViewStyle,

  primaryFullWidth: { ...BASE_VIEW, backgroundColor: color.palette.blue, width: "100%" } as ViewStyle,

  /**
   * A button without extras.
   */
  link: {
    ...BASE_VIEW,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "flex-start"
  } as ViewStyle,

  neutral: { ...BASE_VIEW, backgroundColor: color.palette.orangeDarker } as ViewStyle
}

export const textPresets = {
  primary: { ...BASE_TEXT, fontSize: 9, color: color.palette.white } as TextStyle,
  primaryBold: {...BASE_TEXT, fontSize: 9, color: color.palette.white, fontWeight: "bold" } as TextStyle,
  primaryBoldLarge: {...BASE_TEXT, color: color.palette.white, fontWeight: "bold" } as TextStyle,
  link: {
    ...BASE_TEXT,
    color: color.text,
    paddingHorizontal: 0,
    paddingVertical: 0
  } as TextStyle,
}

/**
 * A list of preset names.
 */
export type ButtonPresetNames = keyof typeof viewPresets
export type ButtonTextPresetNames = keyof typeof textPresets
