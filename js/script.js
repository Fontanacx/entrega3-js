let clientes = [];

function obtenerNombre() {
    return document.getElementById('nombre').value;
}

function obtenerApellido() {
    return document.getElementById('apellido').value;
}

function obtenerMonto() {
    return parseFloat(document.getElementById('monto').value);
}

function obtenerCuotas() {
    return parseInt(document.getElementById('cuotas').value);
}

function calcularInteres(monto, cuotas) {
    let tasaInteresAnual = 0.2; // 20% anual
    let tasaInteresMensual = Math.pow(1 + tasaInteresAnual, 1 / 12) - 1;
    return monto * tasaInteresMensual * cuotas;
}

function calcularCuotas(monto, cuotas, interes) {
    return (monto + interes) / cuotas;
}

function crearCliente(nombre, apellido, monto, cuotas, montoPorCuota, interes) {
    return {
        nombre,
        apellido,
        monto,
        cuotas,
        montoPorCuota,
        interes
    };
}

function mostrarClientes() {
    let listaClientes = document.getElementById('listaClientes');
    listaClientes.innerHTML = "";
    if (clientes.length > 0) {
        clientes.forEach(cliente => {
            listaClientes.innerHTML += `<div class="p-2 bg-gray-100 rounded-md">Nombre: <span class="font-semibold">${cliente.nombre} ${cliente.apellido}</span>, Monto: $${cliente.monto}, Cuotas: ${cliente.cuotas}, Monto por cuota: $${cliente.montoPorCuota.toFixed(2)}, Interés total: $${cliente.interes.toFixed(2)}</div>`;
        });
    } else {
        listaClientes.innerHTML = "<div class='text-gray-500'>No hay clientes registrados.</div>";
    }
}

function buscarClientePorNombre(nombre) {
    return clientes.filter(cliente => cliente.nombre.toLowerCase() === nombre.toLowerCase());
}

function buscarCliente() {
    let nombreBusqueda = document.getElementById('nombreBusqueda').value;
    let resultadoBusqueda = buscarClientePorNombre(nombreBusqueda);
    let resultadosDiv = document.getElementById('resultadosBusqueda');
    resultadosDiv.innerHTML = "";
    if (resultadoBusqueda.length > 0) {
        resultadoBusqueda.forEach(cliente => {
            resultadosDiv.innerHTML += `<div class="p-2 bg-gray-100 rounded-md">Nombre: <span class="font-semibold">${cliente.nombre}</span>, Apellido: ${cliente.apellido}, Monto: $${cliente.monto}, Cuotas: ${cliente.cuotas}, Monto por cuota: $${cliente.montoPorCuota.toFixed(2)}, Interés total: $${cliente.interes.toFixed(2)}</div>`;
        });
    } else {
        resultadosDiv.innerHTML = "<div class='text-gray-500'>No se encontraron clientes con ese nombre.</div>";
    }

    document.getElementById('busquedaForm').reset();
}

function simuladorDeCuotas() {
    let nombre = obtenerNombre();
    let apellido = obtenerApellido();
    let moneda = document.getElementById('moneda').value;
    let monto = obtenerMonto();
    let cuotas = obtenerCuotas();
    let interes = calcularInteres(monto, cuotas);
    let montoPorCuota = calcularCuotas(monto, cuotas, interes);
    let totalPagar = monto + interes;

    let cliente = crearCliente(nombre, apellido, monto, cuotas, montoPorCuota, interes, moneda);
    clientes.push(cliente);

    let dolarBlueVenta = parseFloat(document.getElementById('blueSell').textContent);
    let totalPagarOtraMoneda, simboloMonedaOriginal, simboloMonedaConversion;

    if (moneda === 'ARS') {
        totalPagarOtraMoneda = totalPagar / dolarBlueVenta;
        simboloMonedaOriginal = '$';
        simboloMonedaConversion = 'USD';
    } else {
        totalPagarOtraMoneda = totalPagar * dolarBlueVenta;
        simboloMonedaOriginal = 'USD';
        simboloMonedaConversion = '$';
    }

    let resultadoDiv = document.getElementById('resultadoSimulacion');
    resultadoDiv.innerHTML = `
        Hola <strong>${nombre} ${apellido}</strong>, 
        el monto a pagar por cada cuota es: <strong>${simboloMonedaOriginal}${montoPorCuota.toFixed(2)}</strong>, 
        con un interés total de: <strong>${simboloMonedaOriginal}${interes.toFixed(2)}</strong>, 
        la tasa de interés mensual es de: <strong>${(interes / monto * 100 / cuotas).toFixed(2)}%</strong> 
        y el total a pagar es: <strong>${simboloMonedaOriginal}${totalPagar.toFixed(2)}</strong> 
        (${simboloMonedaConversion}${totalPagarOtraMoneda.toFixed(2)} al cambio actual del dólar blue)
    `;

    mostrarClientes();

    document.getElementById('simuladorForm').reset();
}

function crearCliente(nombre, apellido, monto, cuotas, montoPorCuota, interes, moneda) {
    return {
        nombre,
        apellido,
        monto,
        cuotas,
        montoPorCuota,
        interes,
        moneda
    };
}

function mostrarClientes() {
    let listaClientes = document.getElementById('listaClientes');
    listaClientes.innerHTML = "";
    if (clientes.length > 0) {
        clientes.forEach(cliente => {
            let simboloMoneda = cliente.moneda === 'ARS' ? '$' : 'USD';
            listaClientes.innerHTML += `
                <div class="p-2 bg-gray-100 rounded-md">
                    Nombre: <span class="font-semibold">${cliente.nombre} ${cliente.apellido}</span>, 
                    Monto: ${simboloMoneda}${cliente.monto}, 
                    Cuotas: ${cliente.cuotas}, 
                    Monto por cuota: ${simboloMoneda}${cliente.montoPorCuota.toFixed(2)}, 
                    Interés total: ${simboloMoneda}${cliente.interes.toFixed(2)}
                </div>
            `;
        });
    } else {
        listaClientes.innerHTML = "<div class='text-gray-500'>No hay clientes registrados.</div>";
    }
}

// Mostrar los clientes al cargar la página
document.addEventListener('DOMContentLoaded', mostrarClientes);
function obtenerDatosDelDolar() {
    fetch('https://api.bluelytics.com.ar/v2/latest')
        .then(response => response.json())
        .then(data => {
            document.getElementById('blueBuy').textContent = data.blue.value_buy;
            document.getElementById('blueSell').textContent = data.blue.value_sell;
            document.getElementById('blueAvg').textContent = data.blue.value_avg;
            
            const lastUpdateDate = new Date(data.last_update);
            document.getElementById('lastUpdate').textContent = `Última actualización: ${lastUpdateDate.toLocaleString()}`;
        })
        .catch(error => console.error('Error:', error));
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    mostrarClientes();
    obtenerDatosDelDolar();
    // Actualizar datos cada 5 minutos
    setInterval(obtenerDatosDelDolar, 300000);
});