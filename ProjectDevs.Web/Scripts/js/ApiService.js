/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
var AjaxErrorHandler = function (jqXhr, statusText, error) {
    var errorMessage;
    switch (jqXhr.status) {
        case 0:
            errorMessage = 'Request could not be connected';
            break;
        case 400:
            errorMessage = 'Error 400 - Bad Request - Invalid/Incomplete data';
            break;
        case 401:
            errorMessage = 'Error 401 - Unauthorized Request';
            break;
        case 404:
            errorMessage = 'Error 404 - Requested page not found';
            break;
        case 500:
            //errorMessage = `Error 500 - Internal Server Error - There is an error - ${jqXhr.responseText}`; break;
            errorMessage = "Error 500 - There is an error processing the request";
            break;
    }
    if (errorMessage === undefined) {
        switch (statusText) {
            case 'abort':
                errorMessage = 'Request aborted';
                break;
            case 'timeout':
                errorMessage = 'Request timed out';
                break;
            case 'parsererror':
                errorMessage = 'Response parsing failed';
                break;
            default:
                //errorMessage = `Uncaught error - ${jqXhr.responseText}`; break;
                errorMessage = "Uncaught error - There is an error processing the request";
                break;
        }
    }
    errorMessage = errorMessage || error;
    console.log(jqXhr.responseText);
    var isBadRequest = jqXhr.status === 400;
    if (isBadRequest) {
        var badRequestJson = jqXhr.responseJSON;
        if (badRequestJson) {
            if (badRequestJson.ModelState) {
                var errors = '';
                for (var p in badRequestJson.ModelState) {
                    var key = '';
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
};
var UserTokenHandler = /** @class */ (function () {
    function UserTokenHandler() {
    }
    UserTokenHandler.getToken = function () {
        var storageItem = localStorage.getItem(Constants.TokenName);
        if (storageItem) {
            var tokenWithExpiry = JSON.parse(storageItem);
            if (tokenWithExpiry.ExpiryMiliseconds < new Date().getTime()) {
                // Token has expired; Remove it from storage
                console.log('Token expired');
                this.removeToken();
            }
            else
                return tokenWithExpiry.Token;
        }
        return null;
    };
    UserTokenHandler.setToken = function (tokenModel) {
        if (tokenModel && tokenModel.Token) {
            if (!tokenModel.ExpiryMiliseconds) {
                tokenModel.ExpiryMiliseconds = new Date().getTime() + Constants.TokenExpiryMiliseconds;
            }
            localStorage.setItem(Constants.TokenName, JSON.stringify(tokenModel));
        }
    };
    UserTokenHandler.removeToken = function () {
        localStorage.removeItem(Constants.TokenName);
        this.removeUser();
    };
    UserTokenHandler.setUser = function (user) {
        localStorage.setItem(Constants.UserData, JSON.stringify(user));
    };
    UserTokenHandler.isSuperUser = function () {
        var storageItem = localStorage.getItem(Constants.UserData);
        if (storageItem) {
            var user = JSON.parse(storageItem);
            return user.IsSuperUser == 1;
        }
    };
    UserTokenHandler.isUserStakeholderOrOwnerForProject = function (p) {
        var storageItem = localStorage.getItem(Constants.UserData);
        if (storageItem) {
            var user = JSON.parse(storageItem);
            var ProductOwnerId = p.ProductOwnerId;
            var StakeholderIds = [];
            if (p.StakeholderIdNames) {
                for (var userId in p.StakeholderIdNames) {
                    StakeholderIds.push(userId);
                }
            }
            if (user.UserId == ProductOwnerId)
                return true;
            if ($.inArray(user.UserId, StakeholderIds) != -1)
                return true;
        }
        return false;
    };
    UserTokenHandler.getUser = function () {
        var storageItem = localStorage.getItem(Constants.UserData);
        if (storageItem) {
            var user = JSON.parse(storageItem);
            if (user)
                return user;
        }
    };
    UserTokenHandler.removeUser = function () {
        localStorage.removeItem(Constants.UserData);
    };
    return UserTokenHandler;
}());
var ApiService = /** @class */ (function () {
    function ApiService() {
        this.addTokenToRequest = function (xhr) {
            var token = UserTokenHandler.getToken();
            if (token) {
                xhr.setRequestHeader('Authorization', "Bearer " + token);
                //xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                //xhr.withCredentials = true;
            }
            else {
                Alerts.Info('Session expired. Please login and continue.', 'Session Expired', function () { location.href = WebUrl.Login; });
                return false;
            }
        };
    }
    ApiService.prototype.authenticateUser = function (userNumber) {
        return $.post(ApiUrl.BaseUrl + "/" + ApiUrl.AuthUrl + "/" + userNumber)
            .done(function (userTokenModel) {
            if (userTokenModel && userTokenModel.Token) {
                UserTokenHandler.setToken(userTokenModel.Token);
                UserTokenHandler.setUser(userTokenModel.User);
                location.href = WebUrl.Dashboard;
                return;
            }
            Alerts.Error('Could not authenticate user. Please try again.', 'Authentication Error');
        })
            .fail(AjaxErrorHandler);
    };
    ApiService.prototype.get = function (url, data) {
        if (data === void 0) { data = null; }
        console.log('get', 'url', url);
        return $.ajax({
            url: ApiUrl.BaseUrl + "/" + url,
            data: data,
            type: 'GET',
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    };
    ApiService.prototype.post = function (url, data) {
        if (data === void 0) { data = null; }
        return $.ajax({
            url: ApiUrl.BaseUrl + "/" + url,
            data: data,
            type: 'POST',
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    };
    ApiService.prototype.postJson = function (url, data) {
        if (data === void 0) { data = null; }
        return $.ajax({
            url: ApiUrl.BaseUrl + "/" + url,
            data: data,
            contentType: "application/json",
            type: 'POST',
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    };
    ApiService.prototype.postFile = function (url, data) {
        return $.ajax({
            url: ApiUrl.BaseUrl + "/" + url,
            data: data,
            type: 'POST',
            processData: false,
            contentType: false,
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    };
    ApiService.prototype.put = function (url, data) {
        return $.ajax({
            url: ApiUrl.BaseUrl + "/" + url,
            data: data,
            type: 'PUT',
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    };
    ApiService.prototype.putJson = function (url, data) {
        return $.ajax({
            url: ApiUrl.BaseUrl + "/" + url,
            data: data,
            contentType: "application/json",
            type: 'PUT',
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    };
    ApiService.prototype.patch = function (url, data) {
        return $.ajax({
            url: ApiUrl.BaseUrl + "/" + url,
            data: data,
            type: 'PATCH',
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    };
    ApiService.prototype.delete = function (url) {
        return $.ajax({
            url: ApiUrl.BaseUrl + "/" + url,
            type: 'DELETE',
            beforeSend: this.addTokenToRequest,
            error: AjaxErrorHandler
        });
    };
    return ApiService;
}());
//# sourceMappingURL=ApiService.js.map