import * as React from "react"
import {
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native"

export interface DismissKeyboardProps {

  children: React.ReactNode
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function DismissKeyboard(props: DismissKeyboardProps) {
  // grab the props
  const { children } = props

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  )
}
