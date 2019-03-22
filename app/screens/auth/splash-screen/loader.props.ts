import * as React from "react"

export interface ImageProperties {
  height: number
  width: number
}

export interface ILoaderProps {
  backgroundColor: string
  children: React.ReactNode
  imageProperties: ImageProperties
  imageSource: any
}
