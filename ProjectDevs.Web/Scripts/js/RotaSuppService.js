/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
var RotaSuppService = /** @class */ (function () {
    function RotaSuppService(apiService) {
        this.apiService = apiService;
        this.calendar = $('#calendar');
        this.init();
    }
    RotaSuppService.prototype.loadCalendarData = function () {
        var u = ApiUrl.RotaSupp;
        MainLoader.show();
        this.apiService.get(u, {})
            .done(function (rotaSuppData) {
            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month'
                },
                buttonText: {
                    today: 'today',
                    month: 'month',
                    week: 'week',
                    day: 'day'
                },
                events: function (start, end, timezone, callback) {
                    var events = [];
                    $.each(rotaSuppData, function (i, data) {
                        events.push({
                            title: data.Title,
                            //description: data.Desc,
                            start: data.Start_Date,
                            end: data.End_Date,
                            backgroundColor: "#000",
                            borderColor: "#fc0101"
                        });
                    });
                    callback(events);
                },
                eventRender: function (event, element) {
                    element.qtip({
                        content: event.description
                    });
                },
                editable: false
            });
        })
            .always(function () { return MainLoader.hide(); });
    };
    RotaSuppService.prototype.init = function () {
        this.loadCalendarData();
    };
    return RotaSuppService;
}());
//# sourceMappingURL=RotaSuppService.js.map