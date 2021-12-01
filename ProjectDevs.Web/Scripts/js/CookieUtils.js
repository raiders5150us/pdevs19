/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
var CookieUtils = /** @class */ (function () {
    function CookieUtils(apiService) {
        this.apiService = apiService;
    }
    CookieUtils.prototype.setCookie = function (name, val, expire_days) {
        if (expire_days === void 0) { expire_days = 7; }
        var date = new Date();
        var value = val;
        date.setTime(date.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        // Set it
        document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
    };
    CookieUtils.prototype.getCookie = function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        }
    };
    CookieUtils.prototype.deleteCookie = function (name) {
        var date = new Date();
        // Set it expire in -1 days
        date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
        // Set it
        document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/";
    };
    return CookieUtils;
}());
//# sourceMappingURL=CookieUtils.js.map