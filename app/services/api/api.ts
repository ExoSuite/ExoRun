import { ApiResponse, ApisauceInstance, create } from "apisauce"
import * as https from "https"
import jwtDecode from "jwt-decode"
import { languageTag } from "@i18n/i18n"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import { HttpRequest, toApiSauceMethod } from "./api-http-request"
import { IClient, IGrantRequest, ITokenResponse } from "./api.types"
import { load, save } from "@utils/keychain"
import { Server } from "./api.servers"
import { HttpRequestError } from "@exceptions/HttpRequestError"
import { IService } from "@services/interfaces"
import { LogicErrorState, LogicException } from "@exceptions/LogicException"
import Config from "react-native-config"


/**
 * Manages all requests to the API.
 */
export class Api implements IService {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  private apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  private config: ApiConfig

  private readonly client: IClient

  private readonly grantRequest: IGrantRequest

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.client = {
      client_id: Config.EXOSUITE_USERS_API_CLIENT_ID,
      client_secret: Config.EXOSUITE_USERS_API_CLIENT_SECRET,
    }

    this.grantRequest = {
      ...this.client,
      grant_type: "refresh_token",
      refresh_token: "",
      scope: "",
    }
  }

  private static isITokenResponse(arg: any): arg is ITokenResponse {
    return typeof (arg) !== "boolean"
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  async setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
      httpsAgent: new https.Agent({ keepAlive: true }), // see HTTP keep alive
    })
  }

  /* this function may throw 422  */
  async login(email: string, password: string): Promise<ApiResponse<ITokenResponse>> {
    return this.request(
      HttpRequest.POST,
      "auth/login",
      { email, password, ...this.client },
      {},
      false,
    )
  }

  async request(
    httpMethod: HttpRequest,
    url: string,
    data: Object = {},
    headers: Object = {},
    requireAuth: boolean = true,
  ): Promise<ApiResponse<any>> {

    if (requireAuth) {
      const token: ITokenResponse | boolean = await this.checkToken()
      if (Api.isITokenResponse(token) && token.access_token) {
        headers["Authorization"] = "Bearer " + token.access_token
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

  public async checkToken(): Promise<ITokenResponse | boolean> {
    // get tokens from secure storage
    const credentials: ITokenResponse | boolean = await load(Server.EXOSUITE_USERS_API)
    // check if credentials match with type ITokenResponse
    if (Api.isITokenResponse(credentials)) {
      // decode token
      const decoded = jwtDecode(credentials.access_token)
      console.tron.log(Date.now() / 1000 > decoded.exp, "IF JWT IS EXPIRED")
      // check if token is expired
      if (Date.now() / 1000 > decoded.exp) {
        // assign refresh token to grantRequest
        this.grantRequest.refresh_token = credentials.refresh_token
        // call api for new tokens
        const response = await this.apisauce.post("oauth/token", this.grantRequest)
        // @ts-ignore
        const newTokens: ITokenResponse = response.data
        // save new tokens
        await save(newTokens, Server.EXOSUITE_USERS_API)
        // return new tokens
        return newTokens
      }

      // return non modified tokens
      return credentials
    } else {
      // if tokens was not provided throw an error
      throw new LogicException(LogicErrorState.CANT_LOAD_API_TOKENS)
    }
  }
}
