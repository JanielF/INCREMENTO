using Microsoft.AspNetCore.Mvc;
using System.Data;
using SCRUM.Models;
using Microsoft.Data.SqlClient;

namespace SCRUM.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : Controller
    {
        private readonly string cadena = @"Server=DESKTOP-DPOCLFM\SQLEXPRESS; Database=GestionProductos; Trusted_Connection=True; TrustServerCertificate=true;"; //Conexion a bdd

        [HttpPost("registrarProducto")]
        public IActionResult RegistrarProducto(Producto oProducto)
        {
            using (SqlConnection cn = new SqlConnection(cadena))
            {
                SqlCommand cmd = new SqlCommand("AgregarProducto", cn);
                cmd.CommandType = CommandType.StoredProcedure;

                // Obtener los datos de la consulta
                cmd.Parameters.AddWithValue("@p_nombre", oProducto.Nombre);
                cmd.Parameters.AddWithValue("@p_fecha", oProducto.Fecha);
                cmd.Parameters.AddWithValue("@p_precio", oProducto.Precio);
                cmd.Parameters.AddWithValue("@p_cantidad", oProducto.Cantidad);

                cn.Open();
                cmd.ExecuteNonQuery();

                return Ok("El producto se ha agregado correctamente.");
            }
        }


        [HttpGet("mostrarProductos")]
        public IActionResult MostrarProductos()
        {
            using (SqlConnection cn = new SqlConnection(cadena))
            {
                SqlCommand cmd = new SqlCommand("LeerProductos", cn);
                cmd.CommandType = CommandType.StoredProcedure;

                cn.Open();

                SqlDataReader dr = cmd.ExecuteReader();

                List<Producto> productos = new List<Producto>();

                while (dr.Read())
                {
                    Producto producto = new Producto();

                    producto.Id = Convert.ToInt32(dr["id"]);
                    producto.Nombre = dr["nombre"].ToString();
                    producto.Fecha = Convert.ToDateTime(dr["fecha"]);
                    producto.Precio = Convert.ToDecimal(dr["precio"]);
                    producto.Cantidad = Convert.ToInt32(dr["cantidad"]);

                    productos.Add(producto);
                }

                cn.Close();

                return Ok(productos);
            }
        }


        [HttpPut("editarProductos")]
        public IActionResult EditarPeliculas(Producto oProducto)
        {
            using (SqlConnection cn = new SqlConnection(cadena))
            {
                SqlCommand cmd = new SqlCommand("ActualizarProducto", cn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@p_id", oProducto.Id);
                cmd.Parameters.AddWithValue("@p_nombre", oProducto.Nombre);
                cmd.Parameters.AddWithValue("@p_fecha", oProducto.Fecha);
                cmd.Parameters.AddWithValue("@p_precio", oProducto.Precio);
                cmd.Parameters.AddWithValue("@p_cantidad", oProducto.Cantidad);

                cn.Open();
                cmd.ExecuteNonQuery();

                return Ok("El producto se ha actualizado correctamente.");
            }
        }

        [HttpDelete("eliminarProductos/{id}")]
        public IActionResult EliminarProductos(int id)
        {
            using (SqlConnection cn = new SqlConnection(cadena))
            {
                SqlCommand cmd = new SqlCommand("EliminarProducto", cn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@p_id", id);
                cn.Open();
                cmd.ExecuteNonQuery();

                return Ok("El producto se ha eliminado correctamente.");
            }
        }

        [HttpGet("filtrarProductos/{busqueda}")]
        public IActionResult FiltroTitulo(string busqueda)
        {
            using (SqlConnection cn = new SqlConnection(cadena))
            {
                SqlCommand cmd = new SqlCommand();

                cmd.CommandText = "SELECT * FROM Productos WHERE nombre LIKE '%' + @Busqueda + '%' OR fecha LIKE '%' + @Busqueda + '%' OR precio LIKE '%' + @Busqueda + '%'";
                cmd.Parameters.AddWithValue("@Busqueda", busqueda);

                cmd.Connection = cn;
                cn.Open();

                SqlDataReader dr = cmd.ExecuteReader();

                List<Producto> productos = new List<Producto>();

                while (dr.Read())
                {
                    Producto producto = new Producto();

                    producto.Id = Convert.ToInt32(dr["id"]);
                    producto.Nombre = dr["nombre"].ToString();
                    producto.Fecha = Convert.ToDateTime(dr["fecha"]);
                    producto.Precio = Convert.ToDecimal(dr["precio"]);
                    producto.Cantidad = Convert.ToInt32(dr["cantidad"]);

                    productos.Add(producto);
                }

                cn.Close();

                return Ok(productos);
            }
        }
        
    }

}
