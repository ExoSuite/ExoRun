// this file is for define api responses

export interface TokenResponse {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token: string
}

export interface IClient {
  client_secret: string
  client_id: number
}

export interface User {
  id: number;
  name: string;
}
