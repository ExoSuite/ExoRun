import * as React from "react"
import { TextInput } from "react-native"

export type IVoidFunction = () => void
export type IBoolFunction = () => boolean

export type ITextInputRef = (ref: TextInput) => void

export type IRenderFunction = () => React.ReactNode

export type IOnChangeTextCallback = (text: string) => void

export type IVoidCallbackArray = IVoidFunction[]
