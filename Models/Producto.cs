using System;
using System.Collections.Generic;

namespace SCRUM.Models
{
    public partial class Producto
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public DateTime? Fecha { get; set; }
        public decimal? Precio { get; set; }
        public int? Cantidad { get; set; }
    }
}
