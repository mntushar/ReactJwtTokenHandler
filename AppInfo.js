class AppInfo{
    static mainUrl = document.getElementById('mainUrl')?.value;
    static apiUrl = `${this.mainUrl}/api`;
    static loginUrl = 'account/login';
    static unauthorizedUrl = 'unauthorized';
    static accessTokenName = 'AccessToken';
    static refreshTokenName = 'RefreshToken';
    static tokenKey = 'TokenKey';
    static tokenAlgorithms = 'RS256';
}

export default AppInfo;