import { ApisauceInstance, create, ApiResponse } from "apisauce";
import * as https from "https";
import jwtDecode from "jwt-decode";
import { getGeneralApiProblem } from "./api-problem";
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config";
import { HttpRequest } from "./api-http-request";
import { IClient, IGrantToken, ITokenResponse } from "./api.types";
import { load, save } from "src/lib/keychain";
import { Server } from "./api.servers";


/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance;

  /**
   * Configurable options.
   */
  config: ApiConfig;

  private client: IClient;

  private grantToken: IGrantToken;

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;
    this.client = {
      client_id: 131,
      client_secret: "pxAbi1S7lwQpnYZxIbXiccXb7F8BHP55E7nut4Zs"
    };

    this.grantToken = {
      ...this.client,
      grant_type: "refresh_token",
      refresh_token: "",
      scope: ""
    };
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup(): this {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json"
      },
      httpsAgent: new https.Agent({ keepAlive: true }), // see HTTP keep alive
      adapter: require("axios/lib/adapters/http") // define real http adapter
    });

    return this;
  }

  private static isITokenResponse(arg: any): arg is ITokenResponse {
    return typeof (arg) !== "boolean";
  }

  private static isBoolean(arg: any) {
    return typeof (arg) === "boolean";
  }

  async checkToken(): Promise<ITokenResponse | boolean> {
    // TODO: decode and check if token is expired and refresh the token if expired
    const credentials: ITokenResponse | boolean = await load(Server.EXOSUITE_USERS_API);
    if (Api.isITokenResponse(credentials)) {
      const decoded = jwtDecode(credentials.access_token);
      if (decoded.expires_in <= 0) {
        this.grantToken.refresh_token = credentials.refresh_token;
        const response = await this.apisauce.post("oauth/token", this.grantToken);
        // @ts-ignore
        const ITokenResponse: ITokenResponse = response.data;
        await save(ITokenResponse, Server.EXOSUITE_USERS_API);
        return ITokenResponse;
      }
    }

    if (Api.isBoolean(credentials)) {
      throw new Error("Can't load token!");
    }

    return credentials;
  }

  async request(
    httpMethod: HttpRequest,
    url: string,
    data: Object = {},
    headers: Object = {},
    requireAuth: boolean = true
  ): Promise<ApiResponse<any>> {

    if (requireAuth) {
      const token: ITokenResponse | boolean = await this.checkToken();
      if (Api.isITokenResponse(token) && token.access_token) {
        headers["Authorization"] = "Bearer " + token.access_token;
      } else {
        throw new Error("Required API authentication but access_token was undefined!");
      }
    }

    // set additional headers
    // @ts-ignore
    this.apisauce.setHeaders(headers);

    let apiCall: ApisauceInstance["delete"] | ApisauceInstance["post"]
      | ApisauceInstance["put"] | ApisauceInstance["patch"]
      | ApisauceInstance["get"];

    // choose method to use GET/POST/PUT/PATCH/DELETE
    if (httpMethod === HttpRequest.DELETE) apiCall = this.apisauce.delete;
    else if (httpMethod === HttpRequest.POST) apiCall = this.apisauce.post;
    else if (httpMethod === HttpRequest.PATCH) apiCall = this.apisauce.patch;
    else if (httpMethod === HttpRequest.GET) apiCall = this.apisauce.get;
    else if (httpMethod === HttpRequest.PUT) apiCall = this.apisauce.put;

    // launch api request
    // @ts-ignore
    const response: ApiResponse<any> = await apiCall(url, data);

    // the typical ways to die when calling an api fails
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      throw new Error(problem ? problem.kind : "Request was canceled");
    }

    // return response from api
    return response;
  }
}
