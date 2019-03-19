import { TextInputProps, TextStyle, ViewStyle } from "react-native"

export interface ITextFieldProps extends TextInputProps {

  forwardedRef?: any

  /**
   * Optional style overrides for the input.
   */
  inputStyle?: TextStyle | TextStyle[]

  /**
   * The label text if no labelTx is provided.
   */
  label?: string

  /**
   * The label i18n key.
   */
  labelTx?: string

  /**
   * The Placeholder text if no placeholderTx is provided.
   */
  placeholder?: string
  /**
   * The placeholder i18n key.
   */
  placeholderTx?: string

  /**
   * Various look & feels.
   */
  preset?: string,

  /**
   * Optional container style overrides useful for margins & padding.
   */
  style?: ViewStyle | ViewStyle[]
}
