import { color, typography } from "@theme"
import { TextStyle } from "react-native"

/**
 * All text will start off looking like this.
 */
const BASE: TextStyle = {
  fontFamily: typography.primary,
  color: color.text,
  fontSize: 15
}

/**
 * All the variations of text styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const presets = {
  /**
   * The default text styles.
   */
  default: BASE,

  /**
   * A bold version of the default text.
   */
  bold: { ...BASE, fontWeight: "bold" } as TextStyle,

  centeredBold: { ...BASE, fontWeight: "bold", textAlign: "center" } as TextStyle,

  userRow: { ...BASE, fontSize: 20, fontWeight: "bold" } as TextStyle,

  lightHeader: { ...BASE, fontSize: 18, fontWeight: "bold" } as TextStyle,

  /**
   * Large headers.
   */
  header: { ...BASE, fontSize: 24, fontWeight: "bold" } as TextStyle,

  error: { ...BASE, color: color.error },

  boldError: { ...BASE, color: color.error, fontWeight: "bold" },

  /**
   * Large headers.
   */
  headerCentered: { ...BASE, fontSize: 24, fontWeight: "bold", textAlign: "center" } as TextStyle,

  registerHeaderCentered: { ...BASE, fontSize: 20, fontWeight: "bold", textAlign: "center" } as TextStyle,

  /**
   * Very Large headers centered.
   */
  largeHeaderCentered: { ...BASE, fontSize: 32, fontWeight: "bold", textAlign: "center" } as TextStyle,

  /**
   * Field labels that appear on forms above the inputs.
   */
  fieldLabel: { ...BASE, fontSize: 13, color: color.dim } as TextStyle,

  /**
   * Field labels that appear on forms above the inputs.
   */
  nicknameLight: { ...BASE, fontSize: 13, color: color.palette.lighterGrey } as TextStyle,

  /**
   * A smaller piece of secondard information.
   */
  secondary: { ...BASE, fontSize: 9, color: color.dim } as TextStyle
}

/**
 * A list of preset names.
 */
export type TextPresets = keyof typeof presets
