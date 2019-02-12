import * as React from "react"

export interface ImageProperties {
  height: number
  width: number
}

export interface LoaderProps {
  children: React.ReactNode

  backgroundColor: string

  imageProperties: ImageProperties

  imageSource: any
}
