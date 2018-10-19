import {IAPI} from "app/interfaces";
import {HttpRequest} from "app/enums";
import axios, {AxiosResponse} from 'axios';


interface IClient {
    client_secret: string
    client_id: number
}

// see https://confluence.dev.exosuite.fr/display/APIDoc/Routes+documentation
interface TokenResponse {
    token_type: string
    expires_in: number
    access_token: string
    refresh_token: string
}

export default class API implements IAPI {

    private URL: string;
    private client: IClient;

    constructor() {
        // TODO: define API.URL if release build url = production if debug url = staging
        this.URL = "https://api.dev.exosuite.fr/staging/client";
        // TODO: if release => contact lopez, if debug get client at : https://api.dev.exosuite.fr/staging/client and set it bellow
        this.client = {
            client_id: 131,
            client_secret: "pxAbi1S7lwQpnYZxIbXiccXb7F8BHP55E7nut4Zs"
        }
    }


    async checkToken(): void {
        // TODO: decode and check if token is expired and refresh the token if expired
    }

    async request(httpMethod: HttpRequest, uri: string, data: Object = {}, headers: Object = {}, requireAuth: boolean = true): Promise<AxiosResponse> {
        // TODO: launch checkToken if requireAuth is true
        if (requireAuth) {
            await this.checkToken();
        }
        // TODO: launch request with body data
        // TODO: set 'Content-Type': 'application/json' by default if provided in headers param get value from headers to axios headers
        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
            headers['Authorization'] = "Bearer " + AjouterIciLetoken;
        }
        // TODO: get token add 'Authorization': 'Bearer tokenxxxxxx' to axios headers if requireAuth is true
        if (httpMethod == "POST" ) {
            return await axios.request({method: httpMethod, url: "/auth/login", data: data, headers: headers});
        }
        return await axios.request({method: httpMethod, url: "", data: data, headers: headers});
    }


}
