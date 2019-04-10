// this file is for define api responses

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
  id: string
  name: string
}

export interface IScope {
  description: string
  id: string,
}

export interface IPersonalToken {
  accessToken: string,
}

export interface IPersonalTokenResponse extends IPersonalToken {
  accessToken: string,
  token: {
    client_id: number,
    id: string,
    name: string,
    revoked: boolean,
    scopes: string[],
    user_id: string,
  }
}

export interface IPersonalTokens {
  "connect-io-exorun": string,
  "group-exorun": string,
  "message-exorun": string
  "view-picture-exorun": string,
}
