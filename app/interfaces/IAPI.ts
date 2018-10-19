import {HttpRequest} from 'app/enums'
import {AxiosResponse} from "axios";

export default interface IAPI {
    checkToken(): void;
    request(httpMethod: HttpRequest, uri: string, data: Object, headers: Object, requireAuth: boolean): Promise<AxiosResponse>;
}
