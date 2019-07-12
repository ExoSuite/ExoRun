import * as React from "react"
import { View } from "react-native"
import { ILocation } from "@services/api"

export interface ICheckPointProps {
  location: ILocation
}

// tslint:disable-next-line: completed-docs
export class CheckPoint extends React.Component<ICheckPointProps> {

  public render(): React.ReactNode {
    return (
      <View/>
    )
  }

}
