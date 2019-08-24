import { TextInputProps, TextStyle, ViewStyle } from "react-native"
import { ITextInputRef } from "@custom-types/functions"

export interface ITextFieldProps extends TextInputProps {

  forwardedRef?: ITextInputRef

  /**
   * Optional style overrides for the input.
   */
  inputStyle?: TextStyle | TextStyle[]

  /**
   * The label text if no labelTx Is provided.
   */
  label?: string

  /**
   * The label i18n key.
   */
  labelTx?: string

  /**
   * The Placeholder text if no placeholderTx Is provided.
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
