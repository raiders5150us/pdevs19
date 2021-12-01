using ProjectDevs.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface IRotaSuppRepo
    {
        IEnumerable<RotaSuppData> GetRotaSuppData();
    }
}
