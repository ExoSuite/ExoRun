import * as React from "react"
import { TouchableOpacity, ViewStyle } from "react-native"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { spacing } from "@theme/spacing"
import { palette } from "@theme/palette"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import { AppScreens } from "@navigation/navigation-definitions"
import autobind from "autobind-decorator"

const CONTAINER: ViewStyle = {
  paddingRight: spacing[2]
}

interface IAddNewButtonProps {
  modalScreen: AppScreens
}

/**
 * AddNewButtonIpml will handle the press on edit button
 */
class AddNewButtonIpml extends React.PureComponent<NavigationInjectedProps & IAddNewButtonProps> {

  @autobind
  private onPress(): void {
    this.props.navigation.navigate(this.props.modalScreen)
  }

  public render(): React.ReactNode {
    return (
      <TouchableOpacity onPress={this.onPress} style={CONTAINER}>
        <FontawesomeIcon name="edit" color={palette.white} size={24}/>
      </TouchableOpacity>
    )
  }
}

export const AddNewButton = (props: IAddNewButtonProps): any =>
  withNavigation((navProps: NavigationInjectedProps) => (
      <AddNewButtonIpml {...navProps} modalScreen={props.modalScreen}/>
    )
  )
