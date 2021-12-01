using ProjectDevs.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectDevs.Core.DTO
{
    public class ProjectStoryBulkOrderUpdateWrapperDto
    {
        public List<ProjectStoryBulkOrderUpdateDto> Stories { get; set; }
    }

    public class UpdateBulkTestScriptStepWrapperDto
    {
        public List<TestScriptStep> Steps { get; set; }
    }
    public class ProjectStoryBulkOrderUpdateDto
    {
        public int Id { get; set; }
        public int Order { get; set; }
    }
}
