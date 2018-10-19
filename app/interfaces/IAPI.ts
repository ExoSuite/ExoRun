import {HttpRequest} from 'app/enums'
import {AxiosResponse} from "axios";

export default interface IAPI {
    checkToken(): void;
    request(httpMethod: HttpRequest, data: Object, headers: Object, requireAuth: boolean, uri: string,): Promise<AxiosResponse>;
}