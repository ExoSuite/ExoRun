// this file Is for define api responses

export interface ITokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: string
}

export interface IClient {
  client_id: number
  client_secret: string
}

export interface IGrantRequest extends IClient {
  grant_type: string
  refresh_token: string
  scope: string
}

export interface IUser {
  created_at: string
  email: string
  first_name: string
  follow?: {
    follow_id: string,
    followed_id: string,
    status: boolean,
    user_id: string,
  }
  id: string
  last_name: string
  nick_name?: string
  profile: {
    avatar_id?: string,
    birthday?: string,
    city?: string,
    cover_id?: string
    created_at: string,
    description?: string,
    id: string,
    updated_at: string,
  }
  updated_at: string,
}

export interface IScope {
  description: string
  id: string
}

export interface IPersonalToken {
  accessToken: string,
}

export interface IToken {
  client_id: number,
  id: string,
  name: string,
  revoked: boolean,
  scopes: string[],
  user_id: string,
}

export interface IPersonalTokenResponse extends IPersonalToken {
  token: IToken
}

export interface ICheckIfIamFollowing {
  status: boolean
}
export interface IPersonalTokens {
  "connect-io-exorun": IPersonalTokenResponse,
  "group-exorun": IPersonalTokenResponse,
  "message-exorun": IPersonalTokenResponse
  "view-picture-exorun": IPersonalTokenResponse,
}
