import { EventEmitter } from "events"
import { IGrantRequest, ITokenResponse } from "@services/api/api.types"
import { load, save } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { ApiResponse, ApisauceInstance } from "apisauce"
import { LogicErrorState, LogicException } from "@exceptions/LogicException"
import jwtDecode from "jwt-decode"
import { has } from "lodash-es"

export enum ApiTokenManagerEvent {
  UNLOCK = "unlocked"
}

/**
 * ApiTokenManager will handle the task of refreshing an expired token
 */
// tslint:disable-next-line: min-class-cohesion
export class ApiTokenManager {
  private static set Bus(value: EventEmitter) {
    ApiTokenManager.Instance.bus = value
  }

  public static get Instance(): ApiTokenManager {
    return ApiTokenManager._Instance
  }

  private bus: EventEmitter

  private locked = false
  // tslint:disable-next-line: variable-name
  private static _Instance: ApiTokenManager

  private static async CheckToken(grantRequest: IGrantRequest, apisauce: ApisauceInstance): Promise<ITokenResponse | boolean> {
    const credentials: ITokenResponse = await load(Server.EXOSUITE_USERS_API) as ITokenResponse
    // get tokens from secure storage
    // check if credentials match with type ITokenResponse
    if (ApiTokenManager.IsITokenResponse(credentials)) {
      // decode token
      const decoded = jwtDecode(credentials.access_token)
      // check if token Is expired
      if (Date.now() / 1000 > decoded.exp) {
        // assign refresh token to grantRequest
        grantRequest.refresh_token = credentials.refresh_token
        // call api for new tokens
        const response: ApiResponse<ITokenResponse> = await apisauce.post("oauth/token", grantRequest)
        const newTokens: ITokenResponse = response.data
        // save new tokens
        await save(newTokens, Server.EXOSUITE_USERS_API)

        return newTokens
      }

      // return non modified tokens
      return credentials
    }

    ApiTokenManager.Instance.Unlock()
    // if tokens was not provided throw an error
    throw new LogicException(LogicErrorState.CANT_LOAD_API_TOKENS)
  }

  public static IsITokenResponse(arg: any): arg is ITokenResponse {
    return typeof (arg) !== "boolean" && has(arg, "access_token")
  }

  public static async Setup(): Promise<void> {
    ApiTokenManager._Instance = new ApiTokenManager()
    ApiTokenManager.Bus = new EventEmitter()
  }

  private Lock(): void {
    this.locked = true
  }

  private Unlock(): void {
    this.locked = false
    this.bus.emit(ApiTokenManagerEvent.UNLOCK)
  }

  // this method will wait for _CheckToken to finish and will release the lock
  public async CheckToken(grantRequest: IGrantRequest, apisauce: ApisauceInstance): Promise<ITokenResponse | boolean> {
    if (this.locked) {
      await new Promise((resolve: any): void => {
        this.bus.once(ApiTokenManagerEvent.UNLOCK, resolve)
      })
    }

    this.Lock()
    const result = await ApiTokenManager.CheckToken(grantRequest, apisauce)
    this.Unlock()

    return result
  }
}
