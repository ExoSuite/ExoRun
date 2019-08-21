import { HttpRequestError } from "@exceptions/HttpRequestError"
import { LogicErrorState, LogicException } from "@exceptions/LogicException"
import { languageTag } from "@i18n/i18n"
import { IService } from "@services/interfaces"
import { load, reset, save } from "@utils/keychain"
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import * as https from "https"
import Config from "react-native-config"
import { DEFAULT_API_CONFIG, IApiConfig } from "./api-config"
import { HttpRequest, toApiSauceMethod } from "./api-http-request"
import { getGeneralApiProblem } from "./api-problem"
import { Server } from "./api.servers"
import {
  IClient,
  IGrantRequest,
  IPersonalToken,
  IPersonalTokenResponse,
  IPersonalTokens,
  IScope,
  IToken,
  ITokenResponse,
  IUser
} from "./api.types"
import { ApiRoutes } from "@services/api/api.routes"
import Axios from "axios"
import { IUserModel, updateUserModel } from "@models/user-profile"
import { isEmpty } from "lodash-es"
import { ApiTokenManager } from "@services/api/api.token.manager"

interface IHeaders extends Object {
  Authorization?: string
}

/**
 * Manages all requests to the API.
 */
// tslint:disable-next-line min-class-cohesion
export class Api implements IService {

  public get defaultAvatarUrl(): string {
    return `${this.config.url}/user/default-media/avatar.png`
  }

  public get defaultCoverUrl(): string {
    return `${this.config.url}/user/default-media/cover.jpg`
  }

  /**
   * get the url from api-config
   */
  public get Url(): string {
    return this.config.url
  }

  /**
   * The underlying apisauce Instance which performs the requests.
   */
  private apisauce: ApisauceInstance
  private readonly client: IClient
  private readonly grantRequest: IGrantRequest
  /**
   * Configurable options.
   */
  public readonly config: IApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: IApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.client = {
      client_id: Config.EXOSUITE_USERS_API_CLIENT_ID,
      client_secret: Config.EXOSUITE_USERS_API_CLIENT_SECRET
    }

    this.grantRequest = {
      ...this.client,
      grant_type: "refresh_token",
      refresh_token: "",
      scope: ""
    }
  }

  public static BuildAuthorizationHeader(tokenInstance: IPersonalToken | ITokenResponse): IHeaders {
    return {
      Authorization: `Bearer ${"access_token" in tokenInstance ? tokenInstance.access_token : tokenInstance.accessToken}`
    }
  }

  // tslint:disable-next-line: no-feature-envy
  private async onLocalTokensFulfilled(localPersonalTokens: IPersonalTokens): Promise<void> {
    const response: ApiResponse<IToken[]> = await this.get(ApiRoutes.OAUTH_PERSONAL_ACCESS_TOKENS)
    if (isEmpty(response.data)) { // if something bad is happened or happen create a token set
      await this.onNoPersonalTokensCreateTokenSet()
    } else {
      for (const token of response.data) {
        if (token.revoked) {
          await this.delete(`${ApiRoutes.OAUTH_PERSONAL_ACCESS_TOKENS}/${token.id}`)
          const newPersonalToken: ApiResponse<IPersonalTokenResponse> = await this.post(
            ApiRoutes.OAUTH_PERSONAL_ACCESS_TOKENS,
            { name: token.name, scopes: token.scopes }
          )
          localPersonalTokens[token.name] = newPersonalToken.data
        }
      }
    }

    await save(localPersonalTokens, Server.EXOSUITE_USERS_API_PERSONAL)
  }

  // tslint:disable-next-line: no-feature-envy
  private async onNoPersonalTokensCreateTokenSet(): Promise<void> {
    await reset(Server.EXOSUITE_USERS_API_PERSONAL)

    const oauthScopes: ApiResponse<IScope[]> = await this.get(ApiRoutes.OAUTH_SCOPES)
    const requestTokenPromises = []

    oauthScopes.data.forEach((scope: IScope) => {
      const requestedScopes: string[] = [
        scope.id
      ]
      if (scope.id === "message") {
        requestedScopes.push("group")
      }

      requestTokenPromises.push(this.post(
        ApiRoutes.OAUTH_PERSONAL_ACCESS_TOKENS,
        {
          name: `${scope.id}-exorun`,
          scopes: requestedScopes
        })
      )
    })

    const responseSet = await Axios.all(requestTokenPromises)

    const tokens: IPersonalTokens = {} as IPersonalTokens

    responseSet.forEach((personalAccessTokenResponse: ApiResponse<IPersonalTokenResponse>) => {
      tokens[personalAccessTokenResponse.data.token.name] = personalAccessTokenResponse.data
    })

    await save(tokens, Server.EXOSUITE_USERS_API_PERSONAL)

  }

  // tslint:disable-next-line max-func-args
  private async request(
    httpMethod: HttpRequest,
    url: string,
    data: object = {},
    headers: IHeaders = { Authorization: null },
    // tslint:disable-next-line no-inferrable-types no-flag-args
    requireAuth: boolean = true
  ): Promise<ApiResponse<any>> {

    if (requireAuth && !headers.Authorization) {
      const token: ITokenResponse | boolean = await this.checkToken()
      if (ApiTokenManager.IsITokenResponse(token)) {
        headers.Authorization = `Bearer ${token.access_token}`
      } else {
        throw new LogicException(LogicErrorState.MALFORMED_API_TOKENS)
      }
    }

    headers["X-localization"] = languageTag

    // set additional headers
    // @ts-ignore
    this.apisauce.setHeaders(headers)

    // launch api request
    const response: ApiResponse<any> =
      await this.apisauce[toApiSauceMethod(httpMethod)](url, data)

    // the typical ways to die when calling an api fails
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      throw new HttpRequestError(problem, response)
    }

    // return response from api
    return response
  }

  public buildAvatarUrl(userId: string, token: string): string {
    return `${this.Url}/user/${userId}/${ApiRoutes.PROFILE_PICTURE_AVATAR}?token=${token}`
  }

  public buildCoverUrl(userId: string, token: string): string {
    return `${this.Url}/user/${userId}/${ApiRoutes.PROFILE_PICTURE_COVER}?token=${token}`
  }

  public async checkToken(): Promise<ITokenResponse | boolean> {
    return ApiTokenManager.Instance.CheckToken(this.grantRequest, this.apisauce)
  }

  // tslint:disable-next-line max-func-args
  public async delete(
    url: string,
    data: object = {},
    headers: IHeaders = { Authorization: null },
    // tslint:disable-next-line no-inferrable-types no-flag-args
    requireAuth: boolean = true): Promise<ApiResponse<any>> {
    return this.request(HttpRequest.DELETE, url, data, headers, requireAuth)
  }

  // tslint:disable-next-line max-func-args
  public async get(
    url: string,
    data: object = {},
    headers: IHeaders = { Authorization: null },
    // tslint:disable-next-line no-inferrable-types no-flag-args
    requireAuth: boolean = true): Promise<ApiResponse<any>> {
    return this.request(HttpRequest.GET, url, data, headers, requireAuth)
  }

  public async getOrCreatePersonalTokens(): Promise<void> {
    const localPersonalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens

    if (localPersonalTokens) {
      return this.onLocalTokensFulfilled(localPersonalTokens)
    }

    return this.onNoPersonalTokensCreateTokenSet()
  }

  public async getProfile(userModel?: IUserModel): Promise<void> {
    const userProfileRequest: ApiResponse<IUser> = await this.get(ApiRoutes.USER_ME)
    if (userModel) {
      updateUserModel(userProfileRequest.data, userModel)
    }
  }

  // this function may throw 422
  public async login(email: string, password: string): Promise<ApiResponse<ITokenResponse>> {
    return this.post(ApiRoutes.AUTH_LOGIN, { email, password, ...this.client }, {}, false)
  }

  // tslint:disable-next-line max-func-args
  public async patch(
    url: string,
    data: object = {},
    headers: IHeaders = { Authorization: null },
    // tslint:disable-next-line no-inferrable-types no-flag-args
    requireAuth: boolean = true): Promise<ApiResponse<any>> {
    return this.request(HttpRequest.PATCH, url, data, headers, requireAuth)
  }

  // tslint:disable-next-line max-func-args
  public async post(
    url: string,
    data: object = {},
    headers: IHeaders = { Authorization: null },
    // tslint:disable-next-line no-inferrable-types no-flag-args
    requireAuth: boolean = true): Promise<ApiResponse<any>> {
    return this.request(HttpRequest.POST, url, data, headers, requireAuth)
  }

  // tslint:disable-next-line max-func-args
  public async put(
    url: string,
    data: object = {},
    headers: IHeaders = { Authorization: null },
    // tslint:disable-next-line no-inferrable-types no-flag-args
    requireAuth: boolean = true): Promise<ApiResponse<any>> {
    return this.request(HttpRequest.PUT, url, data, headers, requireAuth)
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * Is mounted.
   *
   * Be as quick as possible in here.
   */
  public async setup(): Promise<void> {
    // construct the apisauce Instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json"
      },
      httpsAgent: new https.Agent({ keepAlive: true }) // see HTTP keep alive
    })
  }
}
