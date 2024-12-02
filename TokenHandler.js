import AppInfo from "./AppInfo";
import {importSPKI, jwtVerify, decodeJwt} from "jose";
import Account from "../../RequestHandlers/Account";
import Response from "./Response"

class TokenHandler {
    responseHandler = new Account();
    response = new Response();

    async getValidAccessToken() {
        let token = this.getItem(AppInfo.accessTokenName)
        if (!token || token.trim() === "") {
            let data = await this.refreshAccessToken();
            if (!data.isSuccess) {
                return data;
            }
            else{
                token = data.message;
            }
        }

        let data = await this.varifyToken(token);
        if (!data.isSuccess){
            data = await this.refreshAccessToken();
            if (!data.isSuccess) {
                return data;
            }
            else{
                token = data.message;
            }
        }

        data = await this.varifyToken(token);
        if (!data.isSuccess)
            return data;

        this.response.isSuccess = true;
        this.response.message = token;

        return this.response;
    }

    async varifyToken(token) {
        try {
            let pemKey = this.getItem(AppInfo.tokenKey);
            if (!pemKey || pemKey.trim() === "") {
                this.response.isSuccess = false;
                this.response.message = "Key is not found.";
                return this.response;
            }
            const key = await importSPKI(pemKey, AppInfo.tokenAlgorithms);
            const {payload} = await jwtVerify(token, key);

            this.response.isSuccess = true;
            this.response.message = payload;
            return this.response;
        } catch (err) {
            this.response.isSuccess = false;
            this.response.message = err;
            return this.response;
        }
    }

    decodeToken(token){
        try{
            const decoded = decodeJwt(token);
            this.response.isSuccess = true;
            this.response.message = decoded;
            return this.response;
        }catch (error){
            this.response.isSuccess = false;
            this.response.message = error;
            return this.response;
        }
    }

    async refreshAccessToken() {
        let refreshToken = this.getItem(AppInfo.refreshTokenName);
        if (!refreshToken || refreshToken.trim() === "") {
            this.response.isSuccess = false;
            this.response.message = "Refresh token is null";
            return this.response;
        }


        let result = await this.responseHandler.refreshToken(refreshToken);
        if (!result.is_success) {
            this.clearAll();
            this.response.isSuccess = false;
            this.response.message = result.message.message;
            return this.response;
        }

        this.setItem(AppInfo.accessTokenName, result.access_token)

        this.response.isSuccess = true;
        this.response.message = result.access_token;

        return this.response;
    }

    setItem(key, data) {
        localStorage.setItem(key, data);
    }

    getItem(key) {
        return localStorage.getItem(key);
    }

    clearAll() {
        localStorage.clear();
    }
}

export default TokenHandler;