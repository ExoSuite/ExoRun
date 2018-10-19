class ServerConfig {
    static host: string  = "https://api.dev.exosuite.fr/";
    static requestHeader: object = {};
    static UNAUTHORIZED: number = 401;
    static BAD_REQUEST: number = 400;
    static SUCCESS: number = 200;
    static FORBIDDEN: number = 403;
}

ServerConfig.requestHeader["client-app-uuid"] = "f0a1b122-f2a0-42ba-851e-e3d5ee409bd0";
ServerConfig.requestHeader["client-app"] = "ExoRun";

export default ServerConfig;