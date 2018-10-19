import ServerConfig from "./ServerConfig";

export default class APIHelpers {
    static defineHeaders() {
        return {
            'Content-Type': 'application/json',
            'client-app': ServerConfig.requestHeader['client-app'],
            'client-app-uuid': ServerConfig.requestHeader['client-app-uuid']
        };
    }
    static defineHeadersGet(token: string) {
        return {
            'Content-Type': 'application/json',
            'client-app': ServerConfig.requestHeader['client-app'],
            'client-app-uuid': ServerConfig.requestHeader['client-app-uuid'],
            'Authorization': 'Bearer ' + token
        };
    }
}