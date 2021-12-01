using ProjectDevs.Core.Enumerations;
using ProjectDevs.Core.Models;

namespace ProjectDevs.Core.Interfaces.Services
{
    public interface IEmailService
    {
        void SendMail(MailUser reciepient, EmailType emailType, MailUser actor, string link);
    }
}