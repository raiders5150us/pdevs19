/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
class CookieUtils {
    constructor(private apiService: ApiService) { }
    setCookie(name: string, val: string, expire_days: number = 7) {
        const date = new Date();
        const value = val;

        date.setTime(date.getTime() + (expire_days * 24 * 60 * 60 * 1000));

        // Set it
        document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
    }

    getCookie(name: string) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");

        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        }
    }

    deleteCookie(name: string) {
        const date = new Date();

        // Set it expire in -1 days
        date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

        // Set it
        document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/";
    }
}
