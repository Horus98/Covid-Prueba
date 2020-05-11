const urlCountries = "https://corona.lmao.ninja/v2/countries";
const urlGlobalSummary = "https://disease.sh/v2/all?yesterday=false";
var input = document.getElementById("pais");
const selectElement = document.getElementById("select");
const jsonCountries = getJSON(urlCountries);
initGlobal();
init();

function getSummaryUrl(country) {
    return (country !== "All") ? "https://disease.sh/v2/countries/" + country + "?yesterday=false&strict=false" : urlGlobalSummary;
}

function getDayOneUrl(country) {
    return "https://corona.lmao.ninja/v2/historical/" + country + "?lastdays=all"
}

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

function getCountries() {
    let arr = []
    for (let i = 0; i < jsonCountries.length; i++) {
        const countryName = jsonCountries[i].country;
        arr.push(countryName);
    }
    return arr;
}

function obtenerInfo(country) {
    const jsonSummary = getJSON(getSummaryUrl(country));
    document.getElementById('deaths').innerHTML = jsonSummary.deaths;
    document.getElementById('recovered').innerHTML = jsonSummary.recovered;
    document.getElementById('confirmed').innerHTML = jsonSummary.cases;
    document.getElementById('active').innerHTML = jsonSummary.active;
    document.getElementById('tests').innerHTML = jsonSummary.tests;
    document.getElementById('critical').innerHTML = jsonSummary.critical;
    setRowVisible();
}

selectElement.onchange = function() {

    var paisSeleccionado = obtenerLocacion();
    pais = paisSeleccionado;
    if (paisSeleccionado === "undefined")
        alerta("Paso algo")
    else {
        if (paisSeleccionado != "All") {
            obtenerInfo(paisSeleccionado);
            drawChart();

        }

    }

}

function initGlobal() {
    obtenerInfo("All");
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
    var paises = getCountries();
    for (i in paises) {
        var opt = document.createElement("option");
        opt.value = paises[i];
        opt.innerHTML = paises[i];
        selectElement.appendChild(opt);
    }
}