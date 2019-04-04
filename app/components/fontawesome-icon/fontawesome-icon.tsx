import { IFontawesomeIconProps } from "@components/fontawesome-icon/font-awesome-icon.props"
import { color as themeColor } from "@theme"
import * as React from "react"
// tslint:disable-next-line: match-default-export-name
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5Pro"

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

  const iconTypes = {
    regular: false,
    light: false,
    solid: false,
    brand: false
  }

  iconTypes[type] = true

  const fontProps = { name, size, color }

  // @ts-ignore
  return <FontAwesome5Icon {...fontProps} {...iconTypes} style={style}/>
}
