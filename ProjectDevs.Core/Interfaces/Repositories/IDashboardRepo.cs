using ProjectDevs.Core.Models;
using System;
using System.Collections.Generic;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface IDashboardRepo
    {
        DashboardStats GetDashboardSummary();
        //DashboardStats GetDashboardSummary(DateTime date);
    }
}
