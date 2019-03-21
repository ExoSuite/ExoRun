import * as React from "react"
import autobind from "autobind-decorator"
import { HeaderBackButtonProps, NavigationActions, NavigationScreenProps, withNavigation } from "react-navigation"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { color, spacing } from "@theme"
import { Button } from "@components"
import { ViewStyle } from "react-native"
import { View } from "react-native-animatable"
import { IVoidFunction } from "@types"

export interface INavigationBackButtonProps {
  enableNestedStackNavigatorGoBack?: boolean
}

const ROOT_STYLE: ViewStyle = {
  padding: spacing[2]
}

/**
 * NavigationBackButton will handle the tap on the chevron-left button in the header
 */
export class NavigationBackButton extends React.PureComponent<HeaderBackButtonProps &
  INavigationBackButtonProps &
  NavigationScreenProps> {

  @autobind
  private nestedStackNavigatorGoBack(): void {
    this.props.navigation.dispatch(NavigationActions.back())
  }

  public render(): React.ReactNode {
    const { enableNestedStackNavigatorGoBack, onPress } = this.props
    const goBack: IVoidFunction = enableNestedStackNavigatorGoBack ? this.nestedStackNavigatorGoBack : onPress

    return (
      <View style={ROOT_STYLE}>
        <Button
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
      </View>
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
