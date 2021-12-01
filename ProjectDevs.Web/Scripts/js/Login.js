/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="ApiService.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
$(function () {
    var apiService = new ApiService();
    var signInBtn = $('#sign-in-btn');
    signInBtn.click(function (e) {
        var userNumber = $('#user-number-txt').val();
        if (userNumber) {
            MainLoader.show();
            apiService.authenticateUser(userNumber)
                .always(function () { return MainLoader.hide(); });
        }
        else {
            Alerts.Error('Enter user number', 'Required');
        }
    });
});
//# sourceMappingURL=Login.js.map