/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="ApiService.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

$(function () {
    const apiService = new ApiService();
    const signInBtn = $('#sign-in-btn');

    signInBtn.click(function (e) {
        const userNumber = $('#user-number-txt').val();
        if (userNumber) {
            MainLoader.show();
            apiService.authenticateUser(userNumber)
                .always(() => MainLoader.hide());
        }
        else {
            Alerts.Error('Enter user number', 'Required');
        }
    });
});