using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Interfaces.Services;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Cache = ProjectDevs.Core.Constants.Cache;

namespace ProjectDevs.Business.Caching
{
    public class CacheService : ICacheService
    {
        private readonly IRepoFactory _repoFactory;

        public CacheService(IRepoFactory repoFactory)
        {
            _repoFactory = repoFactory;
        }

        public IReadOnlyDictionary<string, string> UserNames
        {
            get
            {
                var users = CacheHelper.GetItem<IReadOnlyDictionary<string, string>>(Cache.Keys.UserNames);
                if (users == null)
                {
                    users = _repoFactory.Users.GetUsers()?.ToDictionary(u => u.UserId, u => u.FullName);
                    if (users?.Any() == true)
                        CacheHelper.SetItem(Cache.Keys.UserNames, users);
                }
                return users;
            }
        }
        public IReadOnlyDictionary<int, string> ProjectNames
        {
            get
            {
                var projects = CacheHelper.GetItem<IReadOnlyDictionary<int, string>>(Cache.Keys.ProjectNames);
                if (projects == null)
                {
                    projects = _repoFactory.Projects.GetProjects()?.ToDictionary(p => p.ProjectId, p => p.ProjectName);
                    if (projects?.Any() == true)
                        CacheHelper.SetItem(Cache.Keys.ProjectNames, projects);
                }
                return projects;
            }
        }
        public IReadOnlyDictionary<int, string> TeamNames
        {
            get
            {
                var teams = CacheHelper.GetItem<IReadOnlyDictionary<int, string>>(Cache.Keys.TeamNames);
                if (teams == null)
                {
                    teams = _repoFactory.Masters.GetStatuses("Team")?.ToDictionary(s => s.StatusId, s => s.ListItemText);
                    if (teams?.Any() == true)
                        CacheHelper.SetItem(Cache.Keys.TeamNames, teams);
                }
                return teams;
            }
        }
        public IReadOnlyDictionary<int, string> ProjectStatusNames
        {
            get
            {
                var projectStatuses = CacheHelper.GetItem<IReadOnlyDictionary<int, string>>(Cache.Keys.ProjectStatusNames);
                if (projectStatuses == null)
                {
                    projectStatuses = _repoFactory.Masters.GetStatuses("Project")?.ToDictionary(s => s.StatusId, s => s.ListItemText);
                    if (projectStatuses?.Any() == true)
                        CacheHelper.SetItem(Cache.Keys.ProjectStatusNames, projectStatuses);
                }
                return projectStatuses;
            }
        }
        public IReadOnlyDictionary<int, string> StoryStatusNames
        {
            get
            {
                var storyStatuses = CacheHelper.GetItem<IReadOnlyDictionary<int, string>>(Cache.Keys.StoryStatusNames);
                if (storyStatuses == null)
                {
                    Debug.WriteLine("Cache StoryStatusNames  RepoFactory: " + _repoFactory.GetHashCode());
                    storyStatuses = _repoFactory.Masters.GetStatuses("Story")?.ToDictionary(s => s.StatusId, s => s.ListItemText);
                    if (storyStatuses?.Any() == true)
                        CacheHelper.SetItem(Cache.Keys.StoryStatusNames, storyStatuses);
                }
                return storyStatuses;
            }
        }
        public IReadOnlyDictionary<int, string> TestScriptStatusNames
        {
            get
            {
                var testScriptStatuses = CacheHelper.GetItem<IReadOnlyDictionary<int, string>>(Cache.Keys.TestScriptStatusNames);
                if (testScriptStatuses == null)
                {
                    testScriptStatuses = _repoFactory.Masters.GetStatuses("TestScript")?.ToDictionary(s => s.StatusId, s => s.ListItemText);
                    if (testScriptStatuses?.Any() == true)
                        CacheHelper.SetItem(Cache.Keys.TestScriptStatusNames, testScriptStatuses);
                }
                return testScriptStatuses;
            }
        }

        public IReadOnlyDictionary<int, string> TestScriptStepsStatusNames
        {
            get
            {
                var testScriptStepsStatuses = CacheHelper.GetItem<IReadOnlyDictionary<int, string>>(Cache.Keys.TestScriptStepsStatusNames);
                if (testScriptStepsStatuses == null)
                {
                    testScriptStepsStatuses = _repoFactory.Masters.GetStatuses("TestScriptStep")?.ToDictionary(s => s.StatusId, s => s.ListItemText);
                    if (testScriptStepsStatuses?.Any() == true)
                        CacheHelper.SetItem(Cache.Keys.TestScriptStepsStatusNames, testScriptStepsStatuses);
                }
                return testScriptStepsStatuses;
            }
        }
        public IReadOnlyDictionary<int, string> TaskStatusNames
        {
            get
            {
                var taskStatuses = CacheHelper.GetItem<IReadOnlyDictionary<int, string>>(Cache.Keys.TaskStatusNames);
                if (taskStatuses == null)
                {
                    taskStatuses = _repoFactory.Masters.GetStatuses("Task")?.ToDictionary(s => s.StatusId, s => s.ListItemText);
                    if (taskStatuses?.Any() == true)
                        CacheHelper.SetItem(Cache.Keys.TaskStatusNames, taskStatuses);
                }
                return taskStatuses;
            }
        }
        public IReadOnlyDictionary<int, string> TaskLOBNames
        {
            get
            {
                var taskLOBs = CacheHelper.GetItem<IReadOnlyDictionary<int, string>>(Cache.Keys.TaskLOBNames);
                if (taskLOBs == null)
                {
                    taskLOBs = _repoFactory.Masters.GetStatuses("LOB")?.ToDictionary(s => s.StatusId, s => s.ListItemText);
                    if (taskLOBs?.Any() == true)
                        CacheHelper.SetItem(Cache.Keys.TaskLOBNames, taskLOBs);
                }
                return taskLOBs;
            }
        }
        public IReadOnlyDictionary<int, string> ReportTypes
        {
            get
            {
                var reportTypes = CacheHelper.GetItem<IReadOnlyDictionary<int, string>>(Cache.Keys.RepportTypes);
                if (reportTypes == null)
                {
                    reportTypes = _repoFactory.Masters.GetStatuses("Reports")?.ToDictionary(s => s.StatusId, s => s.ListItemText);
                    if (reportTypes?.Any() == true)
                        CacheHelper.SetItem(Cache.Keys.TaskStatusNames, reportTypes);
                }
                return reportTypes;
            }
        }
        public IReadOnlyDictionary<int, string> StoryTypes
        {
            get
            {
                var storyTypes = CacheHelper.GetItem<IReadOnlyDictionary<int, string>>(Cache.Keys.StoryTypeNames);
                if (storyTypes == null)
                {
                    storyTypes = _repoFactory.Masters.GetStatuses("StoryType")?.ToDictionary(s => s.StatusId, s => s.ListItemText);
                    if (storyTypes?.Any() == true)
                        CacheHelper.SetItem(Cache.Keys.StoryTypeNames, storyTypes);
                }
                return storyTypes;
            }
        }
        public IReadOnlyDictionary<int, string> SprintNames
        {
            get
            {
                var sprints = CacheHelper.GetItem<IReadOnlyDictionary<int, string>>(Cache.Keys.SprintNames);
                if (sprints == null)
                {
                    sprints = _repoFactory.Sprints.GetSprints()?.ToDictionary(p => p.SprintId, p => p.SprintName);
                    if (sprints?.Any() == true)
                        CacheHelper.SetItem(Cache.Keys.SprintNames, sprints);
                }
                return sprints;
            }
        }

        public string GetProjectName(int projectId)
        {
            ProjectNames.TryGetValue(projectId, out var projectName);
            return projectName ?? "";
        }

        public string GetProjectStatusName(int statusId)
        {
            ProjectStatusNames.TryGetValue(statusId, out var statusName);
            return statusName ?? "";
        }
        public string GetProjectTeamName(int teamId)
        {
            TeamNames.TryGetValue(teamId, out var teamName);
            return teamName ?? "";
        }

        public string GetStoryStatusName(int statusId)
        {
            StoryStatusNames.TryGetValue(statusId, out var statusName);
            return statusName ?? "";
        }

        public string GetTaskStatusName(int statusId)
        {
            TaskStatusNames.TryGetValue(statusId, out var statusName);
            return statusName ?? "";
        }
        public string GetStoryTypeName(int storyTypeId)
        {
            StoryTypes.TryGetValue(storyTypeId, out var storyTypeName);
            return storyTypeName ?? "";
        }
        public string GetTestScriptStatusName(int statusId)
        {
            TestScriptStatusNames.TryGetValue(statusId, out var statusName);
            return statusName ?? "";
        }

        public string GetUserName(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return "";
            UserNames.TryGetValue(userId, out var userName);
            return userName ?? "";
        }
        public string GetSprintName(int sprintId)
        {
            SprintNames.TryGetValue(sprintId, out var sprintName);
            return sprintName ?? "";
        }

        public void PurgeCache()
        {
            PurgeUserNames();
            PurgeProjectNames();
            PurgeStatuses();
        }

        public void PurgeProjectNames()
        {
            CacheHelper.RemoveItem(Cache.Keys.ProjectNames);
        }
        public void PurgeSprintNames()
        {
            CacheHelper.RemoveItem(Cache.Keys.SprintNames);
        }

        public void PurgeStatuses()
        {
            CacheHelper.RemoveItem(Cache.Keys.ProjectStatusNames);
            CacheHelper.RemoveItem(Cache.Keys.StoryStatusNames);
            CacheHelper.RemoveItem(Cache.Keys.TaskStatusNames);
            CacheHelper.RemoveItem(Cache.Keys.TestScriptStatusNames);
            CacheHelper.RemoveItem(Cache.Keys.StoryTypeNames);
        }

        public void PurgeUserNames()
        {
            CacheHelper.RemoveItem(Cache.Keys.UserNames);
        }
    }
}
