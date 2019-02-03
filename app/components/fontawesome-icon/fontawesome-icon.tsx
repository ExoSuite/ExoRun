import * as React from "react"
import { ViewStyle } from "react-native"
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {color as themeColor} from "@theme"
import { IconTypes } from "@components"

export type FontawesomeIconTypes = "brand" | "light" | "solid" | "regular"

export interface FontawesomeIconProps {
  /**
   * name of the font awesome icon
   */
  name: IconTypes

  /**
   * type of icon
   */
  type?: FontawesomeIconTypes

  /**
   * color of icon
   */
  color?: string

  /**
   * size of icon
   */
  size?: number

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function FontawesomeIcon(props: FontawesomeIconProps) {
  // grab the props
  const { name, type, size = 16, color = themeColor.primary, style } = props

  const fontProps = {name, size, color}

  let component;
  if (type == "brand") {
    component = <FontAwesome5Pro {...fontProps} brand {...style}/>
  }
  else if (type == "regular") {
    component = <FontAwesome5Pro {...fontProps} regular {...style}/>
  }
  else if (type == "solid") {
    component = <FontAwesome5Pro {...fontProps} solid {...style}/>
  }
  else
    component = <FontAwesome5Pro {...fontProps} light {...style}/>

  return component;
}
