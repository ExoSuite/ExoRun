import * as React from "react"
import { Keyboard, TouchableWithoutFeedback } from "react-native"

export interface IDismissKeyboardProps {
  children: React.ReactNode
}

const dismiss = (): void => {
  Keyboard.dismiss()
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
// tslint:disable-next-line: typedef
export function DismissKeyboard(props: IDismissKeyboardProps) {
  // grab the props
  const { children } = props

  return (
    <TouchableWithoutFeedback onPress={dismiss}>
      {children}
    </TouchableWithoutFeedback>
  )
}