export enum ApiRoutes {
  OAUTH_PERSONAL_ACCESS_TOKENS = "oauth/personal-access-tokens",
  OAUTH_SCOPES = "oauth/scopes",
  USER_ME = "user/me",
  AUTH_REGISTER = "auth/register",
  AUTH_LOGIN = "auth/login",
  USER = "user",
  PROFILE_PICTURE_AVATAR = "profile/picture/avatar",
  PROFILE_PICTURE_COVER = "profile/picture/cover"
}

export function publicUserRoute(userId: string): string {
  return `${ApiRoutes.USER}/${userId}`
}
