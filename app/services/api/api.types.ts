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
  created_at: Date
  email: string
  first_name: string
  id: string
  last_name: string
  nick_name?: string
  profile: {
    avatar_id?: null,
    birthday?: null,
    city?: null,
    cover_id?: null
    created_at: Date,
    description?: null,
    id: string,
    updated_at: Date,
  }
  updated_at: Date,
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

export interface IPersonalTokens {
  "connect-io-exorun": IPersonalTokenResponse,
  "group-exorun": IPersonalTokenResponse,
  "message-exorun": IPersonalTokenResponse
  "view-picture-exorun": IPersonalTokenResponse,
}
