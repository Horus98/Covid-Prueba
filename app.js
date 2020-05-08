var api = "https://api.covid19api.com/summary";
var boton = document.getElementById("botonCalcular");
var input = document.getElementById("pais");
const selectElement = document.getElementById("select");
const miJson = getJSON(api);
init();

function alerta(texto) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: texto,
        timer: 2000,
        confirmButtonColor: '#d33',
        timerProgressBar: true,
    })

}

function obtenerLocacion() {
    return selectElement.options[selectElement.selectedIndex].value;
}

function getJSON(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

function obtenerPaises() {
    var arr = [];
    var i = 0;
    for (i in miJson.Countries) {
        arr[i] = miJson.Countries[i].Country;
    }
    return arr;
}

function obtenerInfo(miPais) {
    var global = miJson.Global;
    var paises = miJson.Countries;
    var info = [];
    for (i in paises) {
        if ((paises[i].Country == miPais) || paises[i].Slug == miPais) {
            info[0] = paises[i].TotalDeaths;
            info[1] = paises[i].TotalRecovered;
            info[2] = paises[i].TotalConfirmed;
        }
    }
    info[3] = global.TotalDeaths;
    info[4] = global.TotalRecovered;
    info[5] = global.TotalConfirmed;
    return info;
}

selectElement.onchange = function() {

    var paisSeleccionado = obtenerLocacion();
    if (paisSeleccionado == "undefined")
        alerta("Paso algo")
    else {
        var arr = obtenerInfo(paisSeleccionado);
        mostrar(arr);
        urlApiDayOne = "https://api.covid19api.com/total/dayone/country/" + paisSeleccionado;
        drawChart();

    }

}


function mostrar(informacion) {
    document.getElementById("info4").innerHTML = informacion[0];
    document.getElementById("info5").innerHTML = informacion[1];
    document.getElementById("info6").innerHTML = informacion[2];
    document.getElementById("info1").innerHTML = informacion[3];
    document.getElementById("info2").innerHTML = informacion[4];
    document.getElementById("info3").innerHTML = informacion[5];
    document.getElementById("infoMuertosPais").innerHTML = "Muertos en " + selectElement.value;
    document.getElementById("infoRecuperadosPais").innerHTML = "Recuperados en " + selectElement.value;
    document.getElementById("infoConfirmadosPais").innerHTML = "Confirmados en " + selectElement.value;

    setRowVisible();
}
/**
 * Hace visible la fila que contiene la informacion de la tabla
 */
function setRowVisible() {
    let listClassesRow = document.getElementById("infoRow").classList
    if (listClassesRow.contains('sr-only'))
    //Solo se ejecuta la primera vez que se selecciona un pais
        listClassesRow.remove('sr-only')
}

function init() {
    var paises = obtenerPaises();
    for (i in paises) {
        var opt = document.createElement("option");
        opt.value = paises[i];
        opt.innerHTML = paises[i];
        selectElement.appendChild(opt);
    }
}