/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

class MeetingService {
    templateLi = $('#meeting-list-item-template > li').first();
    meetingsContainerUl = $('#project-meetings-list');
    pagingContainer = $('#meetings-paging-container');
    infoContainer = $('#apdt_meetings_info');
    startFromElement = this.infoContainer.find('.apdt_startfrom');
    endToElement = this.infoContainer.find('.apdt_endto');
    totalElement = this.infoContainer.find('.apdt_total');

    createEditMeetingModal = $('#create-edit-meetings-modal');
    saveMeetingModalForm = this.createEditMeetingModal.find('#meetings-form');
    saveMeetingBtn = this.createEditMeetingModal.find('#save-meeting-btn');

    private selectedProjectId = 0;
    private selectedTeamIds = "";
    constructor(private isMyPage: boolean, private apiService: ApiService, private isMeetingsPage = false, private selectedMeetingAttendees: { id: string, name: string }[]=[]) {
        this.init();
    }

    loadMeetings(projectId: number, storyTeamId:string, pno = 1, psize = Constants.DefaultPageSize, showPaging = false) {
        this.selectedProjectId = projectId;
        this.selectedTeamIds = storyTeamId;
        const u = this.isMyPage ? ApiUrl.MyMeetings : ApiUrl.ProjectMeetings;
        const projectMeetigsUrl = UrlHelper.GetMeetingsUrl(u, projectId, 0);

        this.apiService.get(projectMeetigsUrl, { pno, psize, storyTeamId })
            .done((meetings: IPagingModel<IProjectMeetingDto>) => {
               
                this.infoContainer.show();
                this.meetingsContainerUl.empty();
                if (meetings && meetings.Data && meetings.Data.length) {
                    meetings.Data.forEach(m => {
                        const li = this.templateLi.clone();
                        li.find('[t-meeting-purpose]').text(m.Purpose);
                        li.find('[t-meeting-date]').text(Utils.JsonDateToStr(m.MeetingDate));
                        li.find('[t-meeting-time]').text(m.MeetingTime);
                        li.find('[t-meeting-project]').text(m.ProjectName);
                        li.find('[t-data-project-id]').attr('data-project-id', m.ProjectId);
                        li.find('[t-data-meeting-id]').attr('data-meeting-id', m.MeetingId);

                        li.find('[t-data-record-id]').attr('data-record-id', m.MeetingId);

                        if (m.AttendeeNames) {
                            const attendees: string[] = m.AttendeeNames;
                            li.find('[t-meeting-attendees-container]').append(attendees.map(s => `<span class="d-tag m-r-5 m-b-5">${s}</span>`));
                        }
                        this.meetingsContainerUl.append(li);
                    });
                    if (showPaging) {
                        const pageModel: IPaginationModel = {
                            CurrentPageNumber: meetings.CurrentPageNumber,
                            IsLastPage: meetings.IsLastPage,
                            PageSize: meetings.PageSize,
                            TotalPages: meetings.Count,
                        };
                        const pagination = Pagination.Render(pageModel);
                        this.pagingContainer.html(`${pagination}`);

                        const startFrom = ((meetings.CurrentPageNumber - 1) * meetings.PageSize) + 1;
                        const endTo = startFrom + meetings.Data.length - 1;

                        this.startFromElement.html(`${startFrom}`);
                        this.endToElement.html(`${endTo}`);
                        this.totalElement.html(`${meetings.Count}`);
                    }
                    
                    if (projectId > 0) {
                        const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);

                        this.apiService.get(projectDetailUrl)
                            .done((project: IProjectDto) => {
                                if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                                    $("[ap-action-meeting-modal-form]").hide();
                                    $("[meeting_ap-action-note-modal-form]").hide();
                                }
                                else {
                                    $("[ap-action-meeting-modal-form]").show();
                                    $("[meeting_ap-action-note-modal-form]").show();
                                }
                            });
                    }
                    else if (UserTokenHandler.isSuperUser()) {
                        $("[ap-action-meeting-modal-form]").show();
                        $("[meeting_ap-action-note-modal-form]").show();
                    }
                    else {
                        $("[ap-action-meeting-modal-form]").hide();
                        $("[meeting_ap-action-note-modal-form]").hide();
                    }
                }
                else {
                    if (!this.isMeetingsPage)
                        Alerts.Info('No meetings found.', 'Empty');
                    if (showPaging) {
                        this.pagingContainer.html('');

                        this.startFromElement.html(`0`);
                        this.endToElement.html(`0`);
                        this.totalElement.html(`0`);
                    }
                }
            });
    }

    setPopupFieldsToUpdateMeeting(m: IProjectMeetingDto) {
        this.saveMeetingModalForm.find('[name=MeetingDate]').val(Utils.JsonDateToStr(m.MeetingDate, true));
        this.saveMeetingModalForm.find('[name=MeetingTime]').val(m.MeetingTime);
        this.saveMeetingModalForm.find('[name=Purpose]').val(m.Purpose);

        for (const userId in m.AttendeeIdNames) {
            

            const stk = { id: userId, name: m.AttendeeIdNames[userId] };
            this.selectedMeetingAttendees.push(stk);
            const selectedUl = this.saveMeetingModalForm.find('#attendees-box-list');
            const li = `<li class="m-r-5 m-b-5 d-tag" data-uid="${stk.id}">
                            <span class="name">${stk.name}</span>
                            <span class="close-btn b" title="Remove">X</span>
                        </li>`;
            selectedUl.append(li);
        }
        if (m.AttendeeIds && m.AttendeeIds.length)
            this.saveMeetingModalForm.find('[name=AttendeeIds]').val(m.AttendeeIds.join(','));
    }

    openCreateMeetingPopup(projectId: number = 0, meetingId: number = 0) {
        const projectsDdl = this.createEditMeetingModal.find('[name=ProjectId]');
        if (projectsDdl && projectsDdl.length && projectId > 0) {
            projectsDdl.val(projectId);
        }
        const meetingIdElement = this.createEditMeetingModal.find('[name=MeetingId]');
        meetingIdElement.val(meetingId);
        if (meetingId > 0) {
            const u = UrlHelper.GetMeetingsUrl(ApiUrl.ProjectMeetingDetail, projectId, meetingId);
            MainLoader.show();
            this.apiService.get(u).done((m: IProjectMeetingDto) => {
                this.setPopupFieldsToUpdateMeeting(m);
                this.createEditMeetingModal.modal('show');
            })
                .always(() => MainLoader.hide());
        }
        else
            this.createEditMeetingModal.modal('show');
    }
    resetProjectMeetingsForm() {
        (this.saveMeetingModalForm[0] as HTMLFormElement).reset();
        this.saveMeetingModalForm.find('input:hidden').val('');
        $('#attendees-box-list').empty();
        this.selectedMeetingAttendees = [];
    }

    private init() {

        $(document).on('click', '#meetings-paging-container a[data-pno]', e => {
            const btn = $(e.target).closest('a[data-pno]');
            const pNo: number = btn.data('pno') || 0;
            if (pNo > 0) {
                this.loadMeetings(this.selectedProjectId, this.selectedTeamIds, pNo, Constants.DefaultPageSize, true);
            }
        });

        this.createEditMeetingModal.on('hide.bs.modal',()=> {
            this.resetProjectMeetingsForm();
        });
        $(document).on('click', '[ap-action-meeting-modal-form]', e => {
            const btn = $(e.target).closest('[ap-action-meeting-modal-form]');
            const projectId: number = btn.data('project-id');
            const meetingId: number = btn.data('meeting-id') || 0;
            this.openCreateMeetingPopup(projectId, meetingId);
        });
        this.saveMeetingBtn.on('click', ()=> {
            
            const projectId: number = this.saveMeetingModalForm.find('[name=ProjectId]').val();
            const meetingId: number = this.saveMeetingModalForm.find('[name=MeetingId]').val() || 0;
            if (meetingId > 0) {
                MainLoader.show();
                const meetingSaveUrl: string = UrlHelper.GetMeetingsUrl(ApiUrl.ProjectMeetingUpdate, projectId, meetingId);
                this.apiService.put(meetingSaveUrl, this.saveMeetingModalForm.serialize())
                    .done((data: any, status: string, xhr: JQueryXHR) => {
                        if (xhr.status === 200 || xhr.status === 201) {
                            Alerts.Success('Meeting saved successfully.');
                            this.createEditMeetingModal.modal('hide');
                            this.loadMeetings(projectId,this.selectedTeamIds);
                        }
                    })
                    .always(() => MainLoader.hide());
            }
            else {
                MainLoader.show();
                const meetingSaveUrl: string = UrlHelper.GetMeetingsUrl(ApiUrl.ProjectMeetingCreate, projectId, 0);
                this.apiService.post(meetingSaveUrl, this.saveMeetingModalForm.serialize())
                    .done((data: any, status: string, xhr: JQueryXHR) => {
                        if (xhr.status === 200 || xhr.status === 201) {
                            Alerts.Success('Meeting created successfully.');
                            this.createEditMeetingModal.modal('hide');
                            this.loadMeetings(projectId, this.selectedTeamIds);
                        }
                    })
                    .always(() => MainLoader.hide());
            }
        });
    }
}
