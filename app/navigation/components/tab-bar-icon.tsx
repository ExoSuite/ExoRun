import * as React from "react"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { TabBarIconProps } from "react-navigation"
import { FontAwesomeIconNames } from "@components/fontawesome-icon/font-awesome-icon.props"

export interface ITabBarIconProps {
  name: FontAwesomeIconNames,
  size: number
}

// tslint:disable-next-line: typedef
export const TabBarIcon = ({ name, size }: ITabBarIconProps) => ({ tintColor, focused }: TabBarIconProps) => {

  const iconType = focused ? "solid" : "light"

  return (
    <FontawesomeIcon
      name={name}
      type={iconType}
      size={size}
      color={tintColor}
    />
  )

}
