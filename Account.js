import HttpHandler from "../library/utility/HttpHandler";
import AppInfo from '../library/utility/AppInfo'

class Account{
    httpHandler = new HttpHandler();
    url = `${AppInfo.apiUrl}/account`;

    async login(data){
        const url = `${this.url}/login`;
        return await this.httpHandler.postWithoutToken(url, data);
    }

    async refreshToken(refreshToken){
        const url = new URL(`${this.url}/access-token/`);
        url.href = `${url.href}?refresh_token=${refreshToken}`;
        return await this.httpHandler.getWithoutToken(url);
    }
}

export default Account;