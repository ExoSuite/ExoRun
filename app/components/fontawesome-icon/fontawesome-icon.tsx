import { IFontawesomeIconProps } from "@components/fontawesome-icon/font-awesome-icon.props"
import { color as themeColor } from "@theme"
import * as React from "react"
import FontAwesome5Pro from "react-native-vector-icons/FontAwesome5Pro"

export type FontawesomeIconTypes = "brand" | "light" | "solid" | "regular"

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
// tslint:disable-next-line: typedef
export function FontawesomeIcon(props: IFontawesomeIconProps) {
  // grab the props
  const { name, type = "solid", size = 16, color = themeColor.primary, style } = props

  const fontProps = { name, size, color }

  let component

  switch (type) {
    case "brand":
      component = <FontAwesome5Pro {...fontProps} brand style={style}/>
      break
    case "regular":
      component = <FontAwesome5Pro {...fontProps} regular style={style}/>
      break
    case "solid":
      component = <FontAwesome5Pro {...fontProps} solid style={style}/>
      break
    default:
      component = <FontAwesome5Pro {...fontProps} light style={style}/>
  }

  return component
}
