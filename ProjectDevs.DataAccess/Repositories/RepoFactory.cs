using ProjectDevs.Core.Interfaces.Repositories;
using System;
using System.Configuration;
using System.Data;

namespace ProjectDevs.DataAccess.Repositories
{
    public class RepoFactory : IRepoFactory
    {
#if DEBUG
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["db_dev"]?.ConnectionString;
#else
            private readonly string  connectionString = ConfigurationManager.ConnectionStrings["db_prod"]?.ConnectionString;
#endif
        private readonly IDbConnection _connection;
        private IDbTransaction _transaction;

        public RepoFactory()
        {
            _connection = new System.Data.SqlClient.SqlConnection(connectionString);
        }

        public IDashboardRepo Dashboard => new DashboardRepo(_connection);
        public IProjectRepo Projects => new ProjectRepo(_connection);
        public IMastersRepo Masters => new MastersRepo(_connection);
        public IFilesRepo Files => new FilesRepo(_connection);
        public INotesRepo Notes => new NotesRepo(_connection);
        public IProjectMeetingRepo ProjectMeetings => new ProjectMeetingRepo(_connection);
        public IProjectStoryRepo ProjectStories => new ProjectStoryRepo(_connection);
        public ISprintRepo Sprints => new SprintRepo(_connection);
        public IStoryTaskRepo StoryTasks => new StoryTaskRepo(_connection);
        public IUserRepo Users => new UserRepo(_connection);
        public ITestScriptRepo TestScripts => new TestScriptRepo(_connection);
        public INotificationRepo Notifications => new NotificationRepo(_connection);
        public ISearchRepo Searchs => new SearchRepo(_connection);
        public IRotaSuppRepo RotaSupp => new RotaSuppRepo(_connection);
        public IDbLogRepo DbLogs => new DbLogRepo(_connection);

        public void OpenConnection()
        {
            if (_connection.State == ConnectionState.Closed)
                _connection.Open();
        }
        public void CloseConnection()
        {
            if (_connection.State == ConnectionState.Open)
            {
                _connection.Close();
            }
        }
        public IDbTransaction BeginTransaction()
        {
            if (_transaction == null)
            {
                OpenConnection();
                _transaction = _connection.BeginTransaction(IsolationLevel.ReadUncommitted);
            }
            return _transaction;
        }
        public IDbTransaction GetTransaction() => _transaction ?? BeginTransaction();

        public void CommitTransaction()
        {
            _transaction?.Commit();
            Dispose();
        }
        public void RollbackTransaction()
        {
            _transaction?.Rollback();
            Dispose();
        }

        // To detect redundant calls
        private bool _disposed = false;
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
            {
                return;
            }

            if (disposing)
            {
                _transaction?.Dispose();
                if (_connection != null)
                {
                    CloseConnection();
                    _connection.Dispose();
                }
            }
            _disposed = true;
        }
        ~RepoFactory() => Dispose(false);
    }
}
