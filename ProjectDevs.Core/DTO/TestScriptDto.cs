using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectDevs.Core.DTO
{
    class TestScriptDto
    {
    }

    public class TestScriptUpdateAssigneeStatusInputDto
    {
        public int testScriptId { get; set; }
        public string userId { get; set; }
        public string userType { get; set; }
        public int statusId { get; set; }
    }

    public class TestScriptStepNoteAddDto
    {
        public int StepId { get; set; }
        public string Note { get; set; }
    }
}
