var productos = []
// =================================================================================
//  Agregar Producto
// =================================================================================
botonGuardar = document.getElementById('botonGuardar').addEventListener('click', function (e) {
    e.preventDefault();
    var mensaje = document.getElementById('mensaje');
    var nombre = document.getElementById('nombre').value;
    var fecha = new Date();
    var year = fecha.getFullYear();
    var month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    var day = ('0' + fecha.getDate()).slice(-2);
    var fechaFormateada = year + '-' + month + '-' + day;
    var precio = parseFloat(document.getElementById('precio').value);
    var cantidad = parseInt(document.getElementById('cantidad').value);
if(nombre == '' || precio == '' || cantidad == ''){
   
    mensaje.innerHTML="Todos los campos son obligatorios";
    }

    else{
        mensaje.innerHTML="";
        var data = {
            id: 0,
            nombre: nombre,
            fecha: fechaFormateada,
            precio: precio,
            cantidad: cantidad
        };
        fetch('https://localhost:7287/Product/registrarProducto', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                document.getElementById('nombre').value = '';
                document.getElementById('precio').value = '';
                document.getElementById('cantidad').value = '';
    
                mostrarProductos();
    
            })
            .catch(error => {
                console.error(error);
            });
    }
      
});


// =================================================================================
//  Mostrar Producto
// =================================================================================
function mostrarProductos() {

    var tBody = document.querySelector('tbody');
    tBody.innerHTML = "";
    fetch('https://localhost:7287/Product/mostrarProductos')
        .then(response => response.json())
        .then(data => {
            data.forEach(function (producto) {


                var fecha = new Date(producto.fecha);
                var year = fecha.getFullYear();
                var month = ('0' + (fecha.getMonth() + 1)).slice(-2);
                var day = ('0' + fecha.getDate()).slice(-2);
                var fechaFormateada = year + '-' + month + '-' + day;
                productos = data;
                var info = document.createElement('tr');
                info.innerHTML = `
            <th scope="row">${producto.id}</th>
            <td>${producto.nombre}</td>
            <td>${fechaFormateada}</td> 
            <td>${producto.precio}</td>
            <td>${producto.cantidad}</td>
            <td>
            <button type="button" class="btn btn-primary" onclick="editarProducto(${producto.id})"><i class="ri-pencil-line"></i></button>
            <button type="button" id="botonEliminar${producto.id}" data-id="${producto.id}" class="btn btn-primary btn-rojo" onclick="eliminarProducto(${producto.id})"><i class="ri-delete-bin-line"></i></button>
          </td>
          
    
          `;

                tBody.appendChild(info);

            });
        })
        .catch(error => {
            console.error('Error al obtener los productos:', error);
        });


}

document.addEventListener('DOMContentLoaded', function () {

    mostrarProductos();
});

// =================================================================================
//  Editar
// =================================================================================
function editarProducto(id) {
    console.log('Editar producto con ID:', id);
    var mensaje = document.getElementById('mensaje');
    mensaje.innerHTML="";
    var cancelarEdicion = document.getElementById('cancelarEdicion');
    cancelarEdicion.addEventListener('click', function () {
        botonesEditar.style.display = 'none';
        botonesGuardar.style.display = 'block';
        var nombre = document.getElementById('nombre');
        var precio = document.getElementById('precio');
        var cantidad = document.getElementById('cantidad');
        nombre.value = '';
        precio.value = '';
        cantidad.value = '';
    });

    var producto = productos.find(function (producto) {
        return producto.id === id;
    });

    if (producto) {
        var botonesEditar = document.getElementById('botonesEditar');
        botonesEditar.style.display = 'block';
        var botonesGuardar = document.getElementById('botonesGuardar');
        botonesGuardar.style.display = 'none';
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('cantidad').value = producto.cantidad;

        var guardarEdicion = document.getElementById('botonEditar');
        guardarEdicion.addEventListener('click', function (e) {
            e.preventDefault();

            var nombreEditar = document.getElementById('nombre').value;
            var precioEditar = parseFloat(document.getElementById('precio').value);
            var cantidadEditar = parseInt(document.getElementById('cantidad').value);
            fecha = producto.fecha;
            var data = {
                id: id,
                nombre: nombreEditar,
                fecha: fecha,
                precio: precioEditar,
                cantidad: cantidadEditar
            };

            fetch('https://localhost:7287/Product/editarProductos', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    botonesEditar.style.display = 'none';
                    botonesGuardar.style.display = 'block';
                    mostrarProductos();
                    nombre.value = '';
                    precio.value = '';
                    cantidad.value = '';
                })
                .catch(error => {
                    console.error(error);
                });
        });
    } else {
        console.log('Producto no encontrado');
    }
}


function asignarEventoEliminar(id) {
    var botonEliminar = document.getElementById('botonEliminar' + id);
    botonEliminar.addEventListener('click', async () => {
        const id = botonEliminar.getAttribute('data-id');
        await fetch(`https://localhost:7287/Product/eliminarProductos/${id}`, { method: 'DELETE' });
        location.reload();
    });
}

function filtrarProductos(filtro) {
    var tBody = document.querySelector('tbody');
    tBody.innerHTML = "";
    fetch(`https://localhost:7287/Product/filtrarProductos/${filtro}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(function (producto) {
                var fecha = new Date(producto.fecha);
                var year = fecha.getFullYear();
                var month = ('0' + (fecha.getMonth() + 1)).slice(-2);
                var day = ('0' + fecha.getDate()).slice(-2);
                var fechaFormateada = year + '-' + month + '-' + day;
                var info = document.createElement('tr');
                info.innerHTML = `
                    <th scope="row">${producto.id}</th>
                    <td>${producto.nombre}</td>
                    <td>${fechaFormateada}</td> 
                    <td>${producto.precio}</td>
                    <td>${producto.cantidad}</td>
                    <td>
                        <button type="button" class="btn btn-primary" onclick="editarProducto(${producto.id})"><i class="ri-pencil-line"></i></button>
                        <button type="button" id="botonEliminar${producto.id}" data-id="${producto.id}" class="btn btn-primary btn-rojo" onclick="eliminarProducto(${producto.id})"><i class="ri-delete-bin-line"></i></button>
                    </td>
                `;
                tBody.appendChild(info);
            });
        })
        .catch(error => {
            console.error('Error al obtener los productos:', error);
        });
}

// Llamar a la función mostrarProductos() inicialmente para cargar todos los productos
filtrarProductos('');

// Agregar evento de búsqueda para filtrar los productos
var searchInput = document.getElementById('searchInput');
var botonBuscar = document.getElementById('botonBuscar');
botonBuscar.addEventListener('click', function() {
    var filtro = searchInput.value;
    filtrarProductos(filtro);
});






