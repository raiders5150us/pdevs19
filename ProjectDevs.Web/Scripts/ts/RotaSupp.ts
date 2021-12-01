/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="RotaSuppService.ts" />
/// <reference path="UserService.ts" />
$(function () {
    const apiService = new ApiService();
    const rotaSuppService = new RotaSuppService(apiService);
});