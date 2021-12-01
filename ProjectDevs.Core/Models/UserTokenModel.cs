namespace ProjectDevs.Core.Models
{
    public class UserTokenModel
    {
        public TokenModel Token { get; set; }
        public ProjectUser User { get; set; }
        public UserTokenModel()
        {

        }
        public UserTokenModel(TokenModel token, ProjectUser user)
        {
            Token = token;
            User = user;
        }
    }
}
