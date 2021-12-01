using System.ComponentModel;

namespace ProjectDevs.Core.Enumerations
{
    // Needs to be in sync with the Database Table dbo.ProjectRoles
    public enum RoleType
    {
        [Description("Business Analyst")]
        BusinessAnalyst = 1,
        [Description("Lead Developer")]        
        LeadDeveloper = 2,
        [Description("Product Owner")]
        ProductOwner = 3,
        [Description("Project Manager")]
        ProjectManager = 4,
        [Description("Stakeholders")]
        Stakeholder = 5,
    }
}
