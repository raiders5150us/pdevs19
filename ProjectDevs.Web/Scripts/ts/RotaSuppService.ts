/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

class RotaSuppService {
    calendar = $('#calendar');
    constructor(private apiService: ApiService) {
        this.init();
    }

    loadCalendarData() {
        const u = ApiUrl.RotaSupp;
        
        MainLoader.show();
        this.apiService.get(u, {  })
            .done((rotaSuppData: IPagingModel<IRotaSuppDto>) => {
                $('#calendar').fullCalendar({
                    header:
                    {
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
                            events.push(
                                {
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
                        element.qtip(
                            {
                                content: event.description
                            });
                    },

                    editable: false
                });
            })
            .always(() => MainLoader.hide());
    }

    private init() {
        this.loadCalendarData();
    }
}