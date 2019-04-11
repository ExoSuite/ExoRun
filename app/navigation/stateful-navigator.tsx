import * as React from "react"
import { inject, observer } from "mobx-react"
// @ts-ignore: until they update @type/react-navigation
import { getNavigation, NavigationScreenProp, NavigationState } from "react-navigation"
import { RootNavigator } from "./root-navigator"
import { NavigationStore } from "./navigation-store"
import { IImageProperties, SplashScreen } from "@screens/auth/splash-screen"
import autobind from "autobind-decorator"
import { Asset } from "@services/asset"
import { color } from "@theme"
import { Screen } from "@services/device"
import { Injection } from "@services/injections"
import { Api, ApiRoutes, IPersonalTokenResponse, IPersonalTokens, IScope, IToken, IUser } from "@services/api"
import { AppScreens } from "@navigation/navigation-definitions"
import { IVoidFunction } from "@types"
import { ApiResponse } from "apisauce"
import { load, save } from "@utils/keychain"
import { load as loadFromStorage, save as saveFromStorage, StorageTypes } from "@utils/storage"
import { Server } from "@services/api/api.servers"
import Axios from "axios"

interface IStatefulNavigatorProps {
  api?: Api
  navigationStore?: NavigationStore,
}

interface IScreenProps {
  animateSplashScreen: IVoidFunction,
  showSplashScreen: IVoidFunction
}

export interface INavigationScreenProps {
  navigation: {
    getScreenProps: IScreenProps
  }
}

const IMAGE_STYLE: IImageProperties = {
  height: Screen.Height,
  width: Screen.Width
}

const exosuiteLoader = Asset.Locator("exosuite-loader")

/**
 * StatefulNavigator will handle the SplashScreen component
 * user can be redirected to login or home screen.
 */
@inject(Injection.NavigationStore, Injection.Api)
@observer
export class StatefulNavigator extends React.Component<IStatefulNavigatorProps> {
  private currentNavProp: NavigationScreenProp<NavigationState>

  private loader: SplashScreen = null

  private async canLogin(): Promise<void> {
    const { api, navigationStore } = this.props

    await api.checkToken()
    await this.getOrCreatePersonalTokens()
    await this.getProfile()
    navigationStore.navigateTo(AppScreens.HOME)
  }

  private async getOrCreatePersonalTokens(): Promise<void> {
    const localPersonalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens

    if (localPersonalTokens) {
      return this.onLocalTokensFulfilled(localPersonalTokens);
    }

    return this.onNoPersonalTokensCreateTokenSet()
  }

  private async getProfile(): Promise<void> {
    const { api } = this.props
    const userProfile: IUser | null = await loadFromStorage(StorageTypes.USER_PROFILE)

    if (!userProfile) {
      const userProfileRequest: ApiResponse<IUser> = await api.get(ApiRoutes.USER_ME)
      await saveFromStorage(StorageTypes.USER_PROFILE, userProfileRequest.data)
    }
  }

  // tslint:disable-next-line: no-feature-envy
  private async onLocalTokensFulfilled(localPersonalTokens: IPersonalTokens): Promise<void> {
    const { api } = this.props

    let localTokensHasBeenModified = false

    const response: ApiResponse<IToken[]> = await api.get(ApiRoutes.OAUTH_PERSONAL_ACCESS_TOKENS)
    response.data.forEach(async (token: IToken) => {
      if (token.revoked && token.name in localPersonalTokens) {
        await api.delete(`${ApiRoutes.OAUTH_PERSONAL_ACCESS_TOKENS}/${token.id}`)
        const newPersonalToken:  ApiResponse<IPersonalTokenResponse> =
          await api.post(ApiRoutes.OAUTH_PERSONAL_ACCESS_TOKENS, { name: token.name, scopes: token.scopes })
        localPersonalTokens[token.name] = newPersonalToken.data
        localTokensHasBeenModified = true
      }
    })

    if (localTokensHasBeenModified) {
      await save(localPersonalTokens, Server.EXOSUITE_USERS_API_PERSONAL)
    }
  }

  // tslint:disable-next-line: no-feature-envy
  private async onNoPersonalTokensCreateTokenSet(): Promise<void> {
    const { api } = this.props
    const oauthScopes: ApiResponse<IScope[]> = await api.get(ApiRoutes.OAUTH_SCOPES)
    const requestTokenPromises = [];
    oauthScopes.data.forEach((scope: IScope) => {
      const requestedScopes: string[] = [
        scope.id
      ]
      if (scope.id === "message") {
        requestedScopes.push("group")
      }

      requestTokenPromises.push(api.post(
        ApiRoutes.OAUTH_PERSONAL_ACCESS_TOKENS,
        {
          name: `${scope.id}-exorun`,
          scopes: requestedScopes
        }
        )
      )
    })

    const responseSet = await Axios.all(requestTokenPromises)

    const tokens: IPersonalTokens = {} as IPersonalTokens;

    responseSet.forEach((personalAccessTokenResponse: ApiResponse<IPersonalTokenResponse>) => {
      tokens[personalAccessTokenResponse.data.token.name] = personalAccessTokenResponse.data
    })

    await save(tokens, Server.EXOSUITE_USERS_API_PERSONAL)

  }

  @autobind
  private async removeLoader(): Promise<void> {
    try {
      await this.canLogin()
    } catch (exception) {
      this.returnToLogin()
    }
    this.animateSplashScreen()
  }

  private returnToLogin(): void {
    const { navigationStore } = this.props

    if (navigationStore.reset) {
      navigationStore.reset()
    }
  }

  @autobind
  private setSplashScreenRef(ref: SplashScreen): void {
    this.loader = ref
  }

  @autobind
  public animateSplashScreen(): void {
    this.loader.animate()
  }

  public async componentDidMount(): Promise<void> {
    await this.removeLoader()
  }

  public getCurrentNavigation = (): NavigationScreenProp<NavigationState> => {
    return this.currentNavProp
  }

  public render(): React.ReactNode {
    // grab our state & dispatch from our navigation store
    const { state, dispatch, actionSubscribers } = this.props.navigationStore
    const { showSplashScreen, animateSplashScreen } = this

    const screenNavigationParams: IScreenProps = {
      showSplashScreen,
      animateSplashScreen
    }

    // create a custom navigation implementation
    this.currentNavProp = getNavigation(
      RootNavigator.router,
      state,
      dispatch,
      actionSubscribers(),
      screenNavigationParams,
      this.getCurrentNavigation
    )

    return (
      <SplashScreen
        ref={this.setSplashScreenRef}
        backgroundColor={color.palette.backgroundDarker}
        imageProperties={IMAGE_STYLE}
        imageSource={exosuiteLoader}
      >
        <RootNavigator navigation={this.currentNavProp}/>
      </SplashScreen>
    )
  }

  @autobind
  public showSplashScreen(): void {
    this.loader.reset()
  }
}
