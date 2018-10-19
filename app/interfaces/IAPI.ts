import {HttpRequest} from 'app/enums'
import {AxiosResponse} from "axios";

// see https://confluence.dev.exosuite.fr/display/APIDoc/Routes+documentation
export interface TokenResponse {
    token_type: string
    expires_in: number
    access_token: string
    refresh_token: string
}

export default interface IAPI {
    checkToken(): Promise<TokenResponse>;

    request(
        httpMethod: HttpRequest,
        url: string,
        data: Object,
        headers: Object,
        requireAuth: boolean
    ): Promise<AxiosResponse>;
}
