import * as React from "react"

export interface IImageProperties {
  height: number
  width: number
}

export interface ILoaderProps {
  backgroundColor: string
  children: React.ReactNode
  imageProperties: IImageProperties
  imageSource: any
}
