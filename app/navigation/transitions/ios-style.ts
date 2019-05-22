import { TransitionConfig } from "react-navigation"
import CardStackStyleInterpolator from "react-navigation-stack/src/views/StackView/StackViewStyleInterpolator"
import { color } from "@theme"

export function TransitionContainerStyle(): any {
  return {
    backgroundColor: color.background
  }
}

export function IosStyle(): TransitionConfig {
  return {
    containerStyle: TransitionContainerStyle(),
    // @ts-ignore
    screenInterpolator: CardStackStyleInterpolator.forHorizontal
  }
}
