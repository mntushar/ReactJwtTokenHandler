class HttpHandler {
    async delete(uri, accessToken) {
        const requestOptions = {
            method: 'DELETE',
            headers: this._buildHeaders(accessToken),
        };
        return await this._sendRequest(uri, requestOptions);
    }

    async get(uri, accessToken) {
        const requestOptions = {
            method: 'GET',
            headers: this._buildHeaders(accessToken),
        };
        return await this._sendRequest(uri, requestOptions);
    }

    async getWithoutToken(uri) {
        const requestOptions = {
            method: 'GET',
            headers: this._buildHeaders(),
        };
        return await this._sendRequest(uri, requestOptions);
    }

    async post(uri, accessToken, value = null) {
        const requestOptions = {
            method: 'POST',
            headers: this._buildHeaders(accessToken),
            body: value ? JSON.stringify(value) : null,
        };
        return await this._sendRequest(uri, requestOptions);
    }

    async postWithoutToken(uri, value = null) {
        const requestOptions = {
            method: 'POST',
            headers: this._buildHeaders(),
            body: value ? JSON.stringify(value) : null,
        };
        return await this._sendRequest(uri, requestOptions);
    }

    async put(uri, accessToken, value = null) {
        const requestOptions = {
            method: 'PUT',
            headers: this._buildHeaders(accessToken),
            body: value ? JSON.stringify(value) : null,
        };
        return await this._sendRequest(uri, requestOptions);
    }

    async postForFile(uri, accessToken, value = null) {
        const formData = new FormData();
        if (value) {
            formData.append('data', JSON.stringify(value));
        }

        const requestOptions = {
            method: 'POST',
            headers: this._buildHeaders(accessToken),
            body: formData,
        };
        return await this._sendFileRequest(uri, requestOptions);
    }

    _buildHeaders(accessToken) {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return headers;
    }

    async _sendRequest(uri, requestOptions) {
        try {
            const response = await fetch(uri, requestOptions);

            if (!response.ok) {
                const errorData = await response.json()
                return this._parseResponse(response, errorData)
            }
            return await response.json();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async _sendFileRequest(uri, requestOptions) {
        try {
            const response = await fetch(uri, requestOptions);
            if (!response.ok) {
                const errorData = await response.json()
                return this._parseResponse(response, errorData)
            }
            return await response.blob();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    _parseResponse(response, error) {
        return {
            is_success: response.ok,
            message: error,
        };
    }
}

export default HttpHandler;
