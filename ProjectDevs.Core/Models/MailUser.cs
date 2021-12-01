namespace ProjectDevs.Core.Models
{
    public struct MailUser
    {
        public string UserId { get; }
        public string Name { get; }
        public MailUser(string userId, string name)
        {
            UserId = userId;
            Name = name;
        }
    }
}
