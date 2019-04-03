import { IFontawesomeIconProps } from "@components/fontawesome-icon/font-awesome-icon.props"
import { color as themeColor } from "@theme"
import * as React from "react"
// tslint:disable-next-line: match-default-export-name
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5Pro"

export type FontawesomeIconTypes = "brand" | "light" | "solid" | "regular"
export const defaultSize = 16

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
// tslint:disable-next-line: typedef
export function FontawesomeIcon(props: IFontawesomeIconProps) {
  // grab the props
  const { name, type = "solid", size = defaultSize, color = themeColor.primary, style } = props

  const fontProps = { name, size, color }

  let component

  switch (type) {
    case "brand":
      component = <FontAwesome5Icon {...fontProps} brand style={style}/>
      break
    case "regular":
      // @ts-ignore
      component = <FontAwesome5Icon {...fontProps} regular style={style}/>
      break
    case "solid":
      component = <FontAwesome5Icon {...fontProps} solid style={style}/>
      break
    default:
      component = <FontAwesome5Icon {...fontProps} light style={style}/>
  }

  return component
}
