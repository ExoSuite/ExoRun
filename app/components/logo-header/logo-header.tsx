import * as React from "react"
import { Image, ImageStyle } from "react-native"
import { Asset } from "@services/asset"

const exorunLogo = Asset.Locator("exorun-logo");

const EXORUN_LOGO: ImageStyle = {
  width: 75,
  height: 35,
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
// tslint:disable-next-line typedef
export function LogoHeader() {

  return (
    <Image
      source={exorunLogo}
      style={EXORUN_LOGO}
      resizeMode="contain"
    />
  )
}
