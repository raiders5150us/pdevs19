using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectDevs.Core.Models
{
    [Table("RotaSuppData", Schema = "dbo")]
    public class RotaSuppData
    {
        [Key, Required]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string UserName { get; set; }

        [Required]
        public DateTime Date { get; set; }
    }
}
