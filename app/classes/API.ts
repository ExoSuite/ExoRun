import {IAPI, TokenResponse} from "app/interfaces";
import {Build, HttpRequest} from "app/enums";
import axios, {AxiosResponse} from 'axios';
import * as https from "https";

interface IClient {
    client_secret: string
    client_id: number
}

interface Headers {
    'Content-Type'?: string,
    Authorization?: string
}

const defaultHeaders = {
    'Content-Type': 'application/json'
};

const defaultAxiosConfig = {
    httpsAgent: new https.Agent({ keepAlive: true }),
    data: {},
    params: {}
};

export default class API implements IAPI {

    private readonly URL: string;
    private client: IClient;

    constructor() {
        // TODO: check value for dev and prod build
        console.log(process.env.NODE_ENV, 'process env');

        if (process.env.NODE_ENV === Build.DEVELOPMENT || process.env.NODE_ENV === Build.TESTING)
            this.URL = "https://api.dev.exosuite.fr/";
        else
            this.URL = 'https://api.exosuite.fr/';

        this.client = {
            client_id: 131,
            client_secret: "pxAbi1S7lwQpnYZxIbXiccXb7F8BHP55E7nut4Zs"
        }
    }


    async checkToken(): Promise<TokenResponse> {
        // TODO: decode and check if token is expired and refresh the token if expired
        return {
            token_type: '',
            access_token: '',
            refresh_token: '',
            expires_in: 0
        };
    }

    async request(
        httpMethod: HttpRequest,
        url: string,
        data: Object = {},
        headers: Headers = defaultHeaders,
        requireAuth: boolean = true
    ): Promise<AxiosResponse> {

        if (requireAuth) {
            const token: TokenResponse = await this.checkToken();
            headers['Authorization'] = "Bearer " + token.access_token;
        }

        // TODO: launch request with body data
        // TODO: set 'Content-Type': 'application/json' by default if provided in headers param get value from headers to axios headers
        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        const axiosConfig = {
            ...defaultAxiosConfig,
            method: httpMethod,
            headers,
            url,
            baseURL: this.URL
        };

        if (httpMethod === HttpRequest.POST || HttpRequest.PATCH || HttpRequest.PUT) {
            axiosConfig.data = data;
        } else {
            axiosConfig.params = data;
        }

        return await axios.request(axiosConfig);
    }


}
