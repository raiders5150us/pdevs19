using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectDevs.Core.Enumerations
{
    public enum TestScriptUserTypes
    {
        [Description("Developer")]
        Developer = 1,
        [Description("Dev Manager")]
        DevManager = 2,
        [Description("Business Analyst")]
        BusinessAnalyst = 3,
        [Description("Business Stakeholder")]
        BusinessStakeholder = 4
    }
}
