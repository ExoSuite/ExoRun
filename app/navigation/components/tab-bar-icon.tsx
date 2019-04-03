import { FontawesomeIcon } from "@components/fontawesome-icon"
import * as React from "react"

// tslint:disable-next-line: typedef
export const TabBarIcon = ({ name, size }) => ({ tintColor, focused }) => {

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
