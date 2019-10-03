import { ViewStyle } from "react-native"
import { isNil } from "ramda"
import { color } from "../../theme"

/**
 * All screen keyboard offsets.
 */
export const offsets = {
  none: 0
}

/**
 * The variations of keyboard offsets.
 */
export type KeyboardOffsets = keyof typeof offsets

export interface IPreset {
  [prop: string]: {
    inner: ViewStyle
    outer: ViewStyle
  }
}

/**
 * All the variations of screens.
 */
export const presets: IPreset = {
  /**
   * No scrolling. Suitable for full-screen carousels and components
   * which have built-in scrolling like FlatList.
   */
  fixed: {
    outer: {
      backgroundColor: color.background,
      flex: 1,
      height: "100%"
    } as ViewStyle,
    inner: {
      justifyContent: "flex-start",
      alignItems: "stretch",
      height: "100%",
      width: "100%"
    } as ViewStyle
  },

  /**
   * No scrolling. Content Is centered on the screen.
   */
  fixedCenter: {
    outer: {
      backgroundColor: color.background,
      flex: 1,
      height: "100%"
    } as ViewStyle,
    inner: {
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%"
    } as ViewStyle
  },

  /**
   * Scrolls. Suitable for forms or other things requiring a keyboard.
   *
   * Pick this one if you don't know which one you want yet.
   */
  scroll: {
    outer: {
      backgroundColor: color.background,
      flex: 1,
      height: "100%"
    } as ViewStyle,
    inner: { justifyContent: "flex-start", alignItems: "stretch" } as ViewStyle
  }
}

/**
 * The variations of screens.
 */
export type ScreenPresets = keyof typeof presets

/**
 * Is this preset a non-scrolling one?
 *
 * @param preset The preset to check
 */
export function isNonScrolling(preset: ScreenPresets): boolean {
  // any of these things will make you scroll
  // @ts-ignore
  return isNil(preset) || !preset.length || isNil(presets[preset]) || preset !== "scroll"
}
