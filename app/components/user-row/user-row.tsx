import * as React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Text } from "../text"
import { Avatar, DefaultRnpAvatarSize } from "@components/avatar"
import { spacing } from "@theme/spacing"

export interface IUserRowProps {
  avatarUrl: string
  firstName: string
  lastName: string
  nickName: string
}

const ROW_CONTAINER: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  paddingTop: spacing[3]
}

const TEXT_CONTAINER: ViewStyle = {
  alignSelf: "center",
  flex: 1
}

const CENTERED_TEXT: TextStyle = {
  textAlign: "center"
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function UserRow(props: IUserRowProps): React.ReactElement {
  // grab the props
  const { firstName, lastName, nickName, avatarUrl } = props

  return (
    <View style={ROW_CONTAINER}>
      <Avatar
        size={DefaultRnpAvatarSize}
        urlFromParent
        avatarUrl={avatarUrl}
      />
      <View style={TEXT_CONTAINER}>
        <Text preset="header" text={`${firstName} ${lastName}`} style={CENTERED_TEXT}/>
        <Text preset="nicknameLight" text={nickName} style={CENTERED_TEXT}/>
      </View>
    </View>
  )
}
