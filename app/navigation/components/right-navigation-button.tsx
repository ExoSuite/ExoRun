import * as React from "react"
import { TouchableOpacity, ViewStyle } from "react-native"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { spacing } from "@theme/spacing"
import { palette } from "@theme/palette"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import { AppScreens } from "@navigation/navigation-definitions"
import autobind from "autobind-decorator"
import { FontAwesomeIconNames } from "@components/fontawesome-icon/font-awesome-icon.props"

const CONTAINER: ViewStyle = {
  paddingRight: spacing[2]
}

interface IRightNavigationButtonIpmlProps {
  color?: string
  icon?: FontAwesomeIconNames
  modalScreen?: AppScreens,
  wantGoBack?: boolean
}

/**
 * AddNewButtonIpml will handle the press on edit button
 */
class RightNavigationButtonIpml extends React.PureComponent<NavigationInjectedProps & IRightNavigationButtonIpmlProps> {

  @autobind
  private onPress(): void {
    if (this.props.wantGoBack) {
      console.tron.log("GO BACK")
      this.props.navigation.goBack()
    } else {
      this.props.navigation.navigate(this.props.modalScreen)
    }
  }

  public render(): React.ReactNode {
    const { icon = "edit", color = palette.white } = this.props

    return (
      <TouchableOpacity onPress={this.onPress} style={CONTAINER}>
        <FontawesomeIcon name={icon} color={color} size={24}/>
      </TouchableOpacity>
    )
  }
}

export const RightNavigationButton = (props: IRightNavigationButtonIpmlProps): any =>
  withNavigation((navProps: NavigationInjectedProps) => (
      <RightNavigationButtonIpml {...navProps} {...props}/>
    )
  )
