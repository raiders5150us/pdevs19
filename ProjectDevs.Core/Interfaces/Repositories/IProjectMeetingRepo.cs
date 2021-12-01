using ProjectDevs.Core.Models;
using System.Collections.Generic;
using System.Data;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface IProjectMeetingRepo
    {
        int? CreateMeeting(ProjectMeeting meeting, IDbTransaction transaction = null);
        int UpdateMeeting(ProjectMeeting meeting, IDbTransaction transaction = null);
        IEnumerable<ProjectMeeting> GetProjectMeetings(int? projectId, string storyTeamId, int? meetingId = null);
    }
}
