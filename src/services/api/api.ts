import { ApisauceInstance, create, ApiResponse } from "apisauce";
import * as https from "https";
import { getGeneralApiProblem } from "./api-problem";
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config";
import { HttpRequest } from "./api-http-request";
import { IClient, TokenResponse } from "./api.types";
import {load} from "src/lib/keychain";


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
      httpsAgent: new https.Agent({ keepAlive: true }), // see HTTP keep alive
      adapter: require('axios/lib/adapters/http') // define real http adapter
    });

    return this;
  }

  async checkToken(): Promise<TokenResponse> {
    // TODO: decode and check if token is expired and refresh the token if expired
    const credentials: any = await load('exosuite-users-api');

    const decoded: any = jwt_decode(credentials.access_token);
    if (decoded.expires_in <= 0) {
      const TestToken: any = {
        grant_type: "refresh_token",
        refresh_token: decoded.refresh_token,
        client_id: this.client.client_id,
        client_refresh: this.client.client_secret,
        scope: "",
      };
      const response: any = this.apisauce.post('https://api.dev.exosuite.fr/oauth/token', TestToken);
      return JSON.parse(response);
    }
    return decoded;
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
