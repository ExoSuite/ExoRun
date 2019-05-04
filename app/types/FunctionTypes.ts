import * as React from "react"
import { TextInput } from "react-native"

export type IVoidFunction = () => void

export type ITextInputRef = (ref: TextInput) => void

export type IRenderFunction = () => React.ReactNode
