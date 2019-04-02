import * as React from "react"
import autobind from "autobind-decorator"
import { HeaderBackButtonProps, NavigationActions, NavigationScreenProps, withNavigation } from "react-navigation"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { color, spacing } from "@theme"
import { Button } from "@components"
import { ViewStyle } from "react-native"
import { IVoidFunction } from "@types"

export interface INavigationBackButtonProps {
  enableNestedStackNavigatorGoBack?: boolean
}

const ROOT_STYLE: ViewStyle = {
  width: spacing[6],
  height: spacing[6],
  marginLeft: spacing[2],
  alignItems: "center"
}

/**
 * NavigationBackButton will handle the tap on the chevron-left button in the header
 */
export class NavigationBackButton extends React.PureComponent<HeaderBackButtonProps &
  INavigationBackButtonProps &
  Partial<NavigationScreenProps>> {

  @autobind
  private nestedStackNavigatorGoBack(): void {
    this.props.navigation.dispatch(NavigationActions.back())
  }

  public render(): React.ReactNode {
    const { enableNestedStackNavigatorGoBack, onPress } = this.props
    const goBack: IVoidFunction = enableNestedStackNavigatorGoBack ? this.nestedStackNavigatorGoBack : onPress

    return (
      <Button
        style={ROOT_STYLE}
        preset="link"
        onPress={goBack}
      >
        <FontawesomeIcon
          type="solid"
          size={20}
          name="chevron-left"
          color={color.palette.lightBlue}
        />
      </Button>
    )
  }
}

export const NavigationBackButtonWithNestedStackNavigator = withNavigation(
  (props: NavigationScreenProps & HeaderBackButtonProps) => (
    <NavigationBackButton
      {...props}
      enableNestedStackNavigatorGoBack
    />
  )
)
