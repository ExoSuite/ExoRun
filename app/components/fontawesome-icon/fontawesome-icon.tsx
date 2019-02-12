import * as React from "react"
import FontAwesome5Pro from "react-native-vector-icons/FontAwesome5Pro"
import { color as themeColor } from "@theme"
import { FontawesomeIconProps } from "@components/fontawesome-icon/font-awesome-icon.props"

export type FontawesomeIconTypes = "brand" | "light" | "solid" | "regular"

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function FontawesomeIcon(props: FontawesomeIconProps) {
  // grab the props
  const { name, type, size = 16, color = themeColor.primary, style } = props

  const fontProps = { name, size, color }

  let component
  if (type == "brand") {
    component = <FontAwesome5Pro {...fontProps} brand {...style}/>
  } else if (type == "regular") {
    component = <FontAwesome5Pro {...fontProps} regular {...style}/>
  } else if (type == "solid") {
    component = <FontAwesome5Pro {...fontProps} solid {...style}/>
  } else
    component = <FontAwesome5Pro {...fontProps} light {...style}/>

  return component
}
