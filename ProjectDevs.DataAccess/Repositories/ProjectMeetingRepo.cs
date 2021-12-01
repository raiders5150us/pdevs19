using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using ProjectDevs.DataAccess.Extensions;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace ProjectDevs.DataAccess.Repositories
{
    public class ProjectMeetingRepo : IProjectMeetingRepo
    {
        private readonly IDbConnection _connection;

        public ProjectMeetingRepo(IDbConnection connection) => _connection = connection;

        public int? CreateMeeting(ProjectMeeting meeting, IDbTransaction transaction = null) =>
             _connection.QueryStoredProcedure<int>(Database.StoredProcedures.PD_CreateProjectMeeting, meeting.GetCreateSpParams(), transaction)
            ?.FirstOrDefault();

        public int UpdateMeeting(ProjectMeeting meeting, IDbTransaction transaction = null) =>
             _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateProjectMeeting, meeting.GetUpdateSpParams(), transaction);

        public IEnumerable<ProjectMeeting> GetProjectMeetings(int? projectId,string storyTeamId, int? meetingId = null) =>
            _connection.QueryStoredProcedure<ProjectMeeting>(Database.StoredProcedures.PD_SelectProjectMeetings, new { projectId, meetingId, storyTeamId })
                ?.ToList();
    }
}
