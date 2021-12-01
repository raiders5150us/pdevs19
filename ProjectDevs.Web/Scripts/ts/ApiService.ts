/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />

const AjaxErrorHandler = (jqXhr: JQueryXHR, statusText: string, error) => {
    let errorMessage;

    switch (jqXhr.status) {
        case 0:
            errorMessage = 'Request could not be connected'; break;
        case 400:
            errorMessage = 'Error 400 - Bad Request - Invalid/Incomplete data'; break;
        case 401:
            errorMessage = 'Error 401 - Unauthorized Request'; break;
        case 404:
            errorMessage = 'Error 404 - Requested page not found'; break;
        case 500:
            //errorMessage = `Error 500 - Internal Server Error - There is an error - ${jqXhr.responseText}`; break;
            errorMessage = `Error 500 - There is an error processing the request`; break;
    }
    if (errorMessage === undefined) {
        switch (statusText) {
            case 'abort':
                errorMessage = 'Request aborted'; break;
            case 'timeout':
                errorMessage = 'Request timed out'; break;
            case 'parsererror':
                errorMessage = 'Response parsing failed'; break;
            default:
                //errorMessage = `Uncaught error - ${jqXhr.responseText}`; break;
                errorMessage = `Uncaught error - There is an error processing the request`; break;
        }
    }
    errorMessage = errorMessage || error;
    console.log(jqXhr.responseText);

    const isBadRequest = jqXhr.status === 400;
    if (isBadRequest) {
        const badRequestJson: { Message?: string, ModelState?: { [PropertyName: string]: string[] } } = jqXhr.responseJSON;
        if (badRequestJson) {
            if (badRequestJson.ModelState) {
                let errors = '';
                for (const p in badRequestJson.ModelState) {
                    let key = '';
                    if (p && p !== '*') {
                        key = p.split('.').pop() + ': ';
                    }
                    errors += key + badRequestJson.ModelState[p].join(', ') + ' <br/> ';
                }
                Alerts.Error(errors, 'Error(s)');
                return;
            }
            else if (badRequestJson.Message) {
                Alerts.Error(badRequestJson.Message, 'Error(s)');
                return;
            }
        }
    }
    console.error(errorMessage);
    Alerts.Error(errorMessage, 'Error(s)');

    /*jqXhr.responseText | jqXhr.responseJSON
     * {"Message":"The request is invalid.","ModelState":{"ProjectName":["The ProjectName field is required."],"*":["Test error"]}}
     * {"Message":"String error will go here"}
     */
}

class UserTokenHandler {
    static getToken() {
        const storageItem = localStorage.getItem(Constants.TokenName);
        if (storageItem) {
            const tokenWithExpiry: ITokenModel = JSON.parse(storageItem);
            if (tokenWithExpiry.ExpiryMiliseconds < new Date().getTime()) {
                // Token has expired; Remove it from storage
                console.log('Token expired');
                this.removeToken();
            }
            else
                return tokenWithExpiry.Token;
        }
        return null;
    }
    static setToken(tokenModel: ITokenModel) {
        if (tokenModel && tokenModel.Token) {
            if (!tokenModel.ExpiryMiliseconds) {
                tokenModel.ExpiryMiliseconds = new Date().getTime() + Constants.TokenExpiryMiliseconds;
            }
            localStorage.setItem(Constants.TokenName, JSON.stringify(tokenModel));
        }
    }
    static removeToken() {
        localStorage.removeItem(Constants.TokenName);
        this.removeUser();
    }

    static setUser(user: IProjectUser) {
        localStorage.setItem(Constants.UserData, JSON.stringify(user));
    }
    static isSuperUser() {
        
        const storageItem = localStorage.getItem(Constants.UserData);
        if (storageItem) {
            const user: IProjectUser = JSON.parse(storageItem);
            return user.IsSuperUser == 1;
        }
    }
    static isUserStakeholderOrOwnerForProject(p: IProjectDto) {
        const storageItem = localStorage.getItem(Constants.UserData);        
        if (storageItem) {
            const user: IProjectUser = JSON.parse(storageItem);

            const ProductOwnerId = p.ProductOwnerId;
            const StakeholderIds: string[] = [];
            if (p.StakeholderIdNames) {
                for (const userId in p.StakeholderIdNames) {
                    StakeholderIds.push(userId);
                }
            }
            if (user.UserId == ProductOwnerId)
                return true;

            if ($.inArray(user.UserId, StakeholderIds) != -1)
                return true;
        }
        return false;
    }
    static getUser(): IProjectUser {
        const storageItem = localStorage.getItem(Constants.UserData);
        if (storageItem) {
            const user: IProjectUser = JSON.parse(storageItem);
            if (user)
                return user;
        }
    }
    static removeUser() {
        localStorage.removeItem(Constants.UserData);
    }
}

class ApiService {
    authenticateUser(userNumber) {
        return $.post(`${ApiUrl.BaseUrl}/${ApiUrl.AuthUrl}/${userNumber}`)
            .done((userTokenModel: UserTokenModel) => {
                
                if (userTokenModel && userTokenModel.Token) {
                    UserTokenHandler.setToken(userTokenModel.Token);
                    UserTokenHandler.setUser(userTokenModel.User);
                    location.href = WebUrl.Dashboard;
                    return;
                }
                Alerts.Error('Could not authenticate user. Please try again.', 'Authentication Error');
            })
            .fail(AjaxErrorHandler);
    }
    get(url, data = null) {
        console.log('get', 'url', url);
        return $.ajax({
            url: `${ApiUrl.BaseUrl}/${url}`,
            data: data,
            type: 'GET',
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    }
    post(url, data = null) {
        return $.ajax({
            url: `${ApiUrl.BaseUrl}/${url}`,
            data: data,
            type: 'POST',
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    }
    postJson(url, data = null) {
        
        return $.ajax({
            url: `${ApiUrl.BaseUrl}/${url}`,
            data: data,
            contentType: "application/json",
            type: 'POST',
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    }
    postFile(url, data: FormData) {
        return $.ajax({
            url: `${ApiUrl.BaseUrl}/${url}`,
            data: data,
            type: 'POST',
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set contentType
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    }
    put(url, data) {
        return $.ajax({
            url: `${ApiUrl.BaseUrl}/${url}`,
            data: data,
            type: 'PUT',
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    }
    putJson(url, data) {
        return $.ajax({
            url: `${ApiUrl.BaseUrl}/${url}`,
            data: data,
            contentType: "application/json",
            type: 'PUT',
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    }
    patch(url, data) {
        return $.ajax({
            url: `${ApiUrl.BaseUrl}/${url}`,
            data: data,
            type: 'PATCH',
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    }
    delete(url) {
        return $.ajax({
            url: `${ApiUrl.BaseUrl}/${url}`,
            type: 'DELETE',
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    }

    private addTokenToRequest = (xhr: XMLHttpRequest) => {
        const token = UserTokenHandler.getToken();
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            //xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            //xhr.withCredentials = true;
        }
        else {
            Alerts.Info('Session expired. Please login and continue.', 'Session Expired', () => { location.href = WebUrl.Login; });
            return false;
        }
    };
}
