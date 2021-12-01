using NLog;
using ProjectDevs.Core.Enumerations;
using ProjectDevs.Core.Interfaces.Services;
using ProjectDevs.Core.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net.Mail;

namespace ProjectDevs.Business.Services
{
    public class EmailService : IEmailService
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        private static readonly Dictionary<EmailType, (string Subject, string Body)> _mailTemplates;
        static EmailService()
        {
            _mailTemplates = new Dictionary<EmailType, (string Subject, string Body)>
            {
                {EmailType.UserStoryAssigned, ("User Story Assigned","Hi {0},<br />You have been assigned an user story by {1}.<br /><a href=\"{2}\">Click here to go to the user story</a>") },
                {EmailType.TestScriptAssigned, ("Test Script Assigned","Hi {0},<br />You have been assigned a test script by {1}.<br /><a href=\"{2}\">Click here to go to the test script</a>") },
                {EmailType.TestScriptApproved, ("Test Script Approved","Hi {0},<br />Your test script has been approved by {1}.<br /><a href=\"{2}\">Click here to go to the test script</a>") },
            };
        }
        public EmailService()
        {
        }
        public void SendMail(MailUser reciepient, EmailType emailType, MailUser actor, string link)
        {
            if (_mailTemplates.TryGetValue(emailType, out var template))
            {
                var to = GetEmailId(reciepient.UserId);
                var mailBody = string.Format(template.Body, reciepient.Name, actor.Name, link);
                SendEmail(to, template.Subject, mailBody);
            }
            else
                throw new Exception($"There is no template defined for the given EmailType {emailType.ToString()}");
        }

        private string GetEmailId(string userId) => $"{userId}@{ConfigurationManager.AppSettings[Core.Constants.AppSettings.EmailDomain]}";

        private void SendEmail(string to, string subject, string body)
        {
            using (var smtpClient = new SmtpClient())
            {
                try
                {
                    using (var mailMessage = new MailMessage
                    {
                        Subject = subject,
                        IsBodyHtml = true,
                        Body = body,
                    })
                    {
                        mailMessage.To.Add(to);
                        smtpClient.Send(mailMessage);
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error(ex, $"Error in sending email. Subject: {subject}.{Environment.NewLine}Body: {body}");
                }
            }
        }
    }
}
