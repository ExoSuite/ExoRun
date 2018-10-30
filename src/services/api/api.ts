import { ApisauceInstance, create, ApiResponse } from "apisauce";
import * as https from "https";
import { getGeneralApiProblem } from "./api-problem";
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config";
import { HttpRequest } from "./api-http-request";
import { IClient, TokenResponse } from "./api.types";

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
        Accept: "application/json",
      },
      httpsAgent: new https.Agent({ keepAlive: true }),
      adapter: require('axios/lib/adapters/http')
    });

    return this;
  }

  async checkToken(): Promise<TokenResponse> {
    // TODO: decode and check if token is expired and refresh the token if expired
    return {
      token_type: "",
      access_token: "",
      refresh_token: "",
      expires_in: 0
    };
  }

  async request(
    httpMethod: HttpRequest,
    url: string,
    data: Object = {},
    headers: Object = {},
    requireAuth: boolean = true
  ): Promise<ApiResponse<any>> {

    if (requireAuth) {
      const token: TokenResponse = await this.checkToken();
      if (!token.access_token)
        throw new Error("Required API authentication but access_token was undefined!");
      headers["Authorization"] = "Bearer " + token.access_token;
    }

    // @ts-ignore
    this.apisauce.setHeaders(headers);

    let apiCall: ApisauceInstance["delete"] | ApisauceInstance["post"]
      | ApisauceInstance["put"] | ApisauceInstance["patch"]
      | ApisauceInstance["get"];

    if (httpMethod === HttpRequest.DELETE) apiCall = this.apisauce.delete;
    else if (httpMethod === HttpRequest.POST) apiCall = this.apisauce.post;
    else if (httpMethod === HttpRequest.PATCH) apiCall = this.apisauce.patch;
    else if (httpMethod === HttpRequest.GET) apiCall = this.apisauce.get;
    else if (httpMethod === HttpRequest.PUT) apiCall = this.apisauce.put;

    // @ts-ignore
    const response: ApiResponse<any> = await apiCall(url, data);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      throw new Error(problem ? problem.kind : "Request was canceled");
    }

    return response;
  }
}
