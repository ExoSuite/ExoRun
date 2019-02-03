import * as React from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { HeaderProps } from "./header.props"
import { spacing } from "@theme"
import { translate } from "@i18n"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { Button } from "@components/button"
import { Text } from "@components/text"
import { Asset } from "@services/asset"

// static styles
const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: spacing[4],
  alignItems: "center",
  paddingTop: spacing[5],
  paddingBottom: spacing[5],
  justifyContent: "flex-start"
}
const TITLE: TextStyle = { textAlign: "center" }
const TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: "center" }
const LEFT: ViewStyle = { width: 32 }
const RIGHT: ViewStyle = { width: 32 }

const EXORUN_LOGO: ImageStyle = {
  width: 75,
  height: 35,
  alignSelf: "center",
}


/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export class Header extends React.Component<HeaderProps, {}> {
  render() {
    const {
      onLeftPress,
      onRightPress,
      rightIcon,
      rightIconColor,
      rightIconSize,
      rightIconType,
      rightIconStyle = {},
      leftIcon,
      leftIconColor,
      leftIconType,
      leftIconSize,
      leftIconStyle = {},
      headerText,
      headerTx,
      titleStyle
    } = this.props
    const header = headerText || (headerTx && translate(headerTx)) || ""

    return (
      <View style={{ ...ROOT, ...this.props.style }}>
        {leftIcon ? (
          <Button preset="link" onPress={onLeftPress}>
            <FontawesomeIcon
              type={leftIconType}
              size={leftIconSize}
              name={leftIcon}
              color={leftIconColor}
              style={leftIconStyle}
            />
          </Button>
        ) : (
          <View style={LEFT}/>
        )}
        {
          header ? (
              <View style={TITLE_MIDDLE}>
                <Text style={{ ...TITLE, ...titleStyle }} text={header}/>
              </View>
          ) :
            (
              <View style={TITLE_MIDDLE}>
                <Image
                  source={Asset.Locator("exorun-logo")}
                  style={EXORUN_LOGO}
                  resizeMode="contain"
                />
              </View>
            )
        }

        {rightIcon ? (
          <Button preset="link" onPress={onRightPress}>
            <FontawesomeIcon
              type={rightIconType}
              size={rightIconSize}
              name={rightIcon}
              color={rightIconColor}
              style={rightIconStyle}
            />
          </Button>
        ) : (
          <View style={RIGHT}/>
        )}
      </View>
    )
  }
}
