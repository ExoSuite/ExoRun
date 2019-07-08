// this file Is for define api responses

interface ITimestamps {
  created_at: string,
  updated_at: string,
}

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

export interface IPost {
  author_id: string
  content: string
  created_at: string
  dashboard_id: string
  id: string
  updated_at: string
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

export interface IGroup extends ITimestamps {
  id: string
  name: string
}

export interface IMessage extends ITimestamps {
  contents: string,
  group_id: string,
  id: string,
  user_id: string
}

export interface IRun extends ITimestamps {
  creator_id: string,
  description: string,
  id: string,
  name: string,
  visibility: string
}

export interface ITime extends ITimestamps {
  check_point_id: string,
  current_time: bigint,
  id: string,
  run_id: string,
}

// tslint:disable-next-line: completed-docs
export class PersonalTokenImpl implements IPersonalToken {
  public accessToken: string
}

export interface ILocation {
  coordinates: number[][][]
  type: IGeoJsonType
}

export interface IGeoJsonGeometry {
  coordinates: [[[number, number]]]
  type: IGeoJsonType
}

export interface IPaginate<Template> {
  current_page: number
  data: Template[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: string
  to: number
  total: number
}

export enum ICheckPointType {
  START = "start",
  DEFAULT = "checkpoint",
  ARRIVAL = "arrival"
}

export interface ICheckPoint extends ITimestamps {
  id: string,
  location: ILocation
  previous_checkpoint_id: string
  run_id: string
  times: []
  type: ICheckPointType,
}

export interface IRun extends ITimestamps {
  checkpoints: ICheckPoint[]
  creator_id: string
  description: string
  id: string
  name: string
  visibility: string
}

export interface ITime {
  check_point_id: string
  current_time: number
  id: string
  run_id: string
}

export interface IFeature {
  geometry: IGeoJsonGeometry
  properties: object,
  type: string,
}

export interface IFeatureCollection {
  features: IFeature[]
  type: string
}

export enum IGeoJsonType {
  FEATURE_COLLECTION = "FeatureCollection",
  FEATURE = "Feature",
  POLYGON = "Polygon"
}
