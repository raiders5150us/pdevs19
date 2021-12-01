namespace ProjectDevs.Core.Models
{
    public struct TokenModel
    {
        public string Token { get; set; }
        public long ExpiryMiliseconds { get; set; }
        public TokenModel(string token, long expiryMiliseconds)
        {
            Token = token;
            ExpiryMiliseconds = expiryMiliseconds;
        }
    }
}
