import * as React from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { FontAwesomeIconNames } from "@components/fontawesome-icon/font-awesome-icon.props"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { palette } from "@theme/palette"
import { IVoidFunction } from "@types"

export interface ITouchableGreyscaledIconProps {
  children: React.ReactNode
  fullScreen?: boolean
  /**
   * name of the font awesome icon
   */
  iconName: FontAwesomeIconNames
  iconSize: number
  onPress: IVoidFunction
  opacity?: number
  size?: number
  style?: ViewStyle
}

const ROOT_CONTAINER: ViewStyle = {
  flex: 1,
  maxHeight: 150
}

const GREYSCALED_VIEW: ViewStyle = {
  backgroundColor: "#121212",
  position: "absolute",
  overflow: "hidden",
  justifyContent: "center",
  alignItems: "center"
}

const FULL: ViewStyle = {
  width: "100%",
  height: "100%"
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function TouchableGreyscaledIcon(props: ITouchableGreyscaledIconProps): React.ReactElement {
  // grab the props
  const { children, iconName, iconSize, size, style, onPress, opacity = 0.70, fullScreen = true } = props

  const container: ViewStyle = fullScreen ? ROOT_CONTAINER :
    { height: size * 1.25, width: size * 1.25 }

  const scaledStyle: ViewStyle = fullScreen ?
    { ...GREYSCALED_VIEW, ...FULL, opacity } :
    { ...GREYSCALED_VIEW, height: size, width: size, borderRadius: size / 2, opacity }

  return (
    <TouchableOpacity style={[container, style]} onPress={onPress}>
      {children}
      <View style={scaledStyle}>
        <FontawesomeIcon name={iconName} color={palette.white} size={iconSize}/>
      </View>
    </TouchableOpacity>
  )
}
