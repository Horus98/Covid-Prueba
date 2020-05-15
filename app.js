const urlCountries = "https://corona.lmao.ninja/v2/countries";
const urlGlobalSummary = "https://disease.sh/v2/all?yesterday=false";
var input = document.getElementById("pais");
const selectElement = document.getElementById("select");
getJSON(urlCountries, init);


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

function getJSON(theUrl, callbackFunction) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, true);

    xmlHttp.onload = function() {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                callbackFunction(xmlHttp.responseText);
            } else {
                alerta("No hay datos historicos de este pais");
            }
        }
    }

    xmlHttp.send(null);
}

function init(responseText) {
    initGlobal();
    populateSelect(responseText);
}

function insertInTable(responseText) {
    jsonSummary = JSON.parse(responseText)
    document.getElementById('deaths').innerHTML = new Intl.NumberFormat("de-ES").format(jsonSummary.deaths);
    document.getElementById('recovered').innerHTML = new Intl.NumberFormat("de-ES").format(jsonSummary.recovered);
    document.getElementById('confirmed').innerHTML = new Intl.NumberFormat("de-ES").format(jsonSummary.cases);
    document.getElementById('active').innerHTML = new Intl.NumberFormat("de-ES").format(jsonSummary.active);
    document.getElementById('tests').innerHTML = new Intl.NumberFormat("de-ES").format(jsonSummary.tests);
    document.getElementById('critical').innerHTML = new Intl.NumberFormat("de-ES").format(jsonSummary.critical);
    setRowVisible();
}


function populateSelect(responseText) {
    var paises = getCountries(responseText);
    for (i in paises) {
        var opt = document.createElement("option");
        opt.value = paises[i];
        opt.innerHTML = paises[i];
        selectElement.appendChild(opt);
    }
}

function getCountries(responseText) {
    let jsonCountries = JSON.parse(responseText)
    let arr = []
    for (let i = 0; i < jsonCountries.length; i++) {
        const countryName = jsonCountries[i].country;
        arr.push(countryName);
    }
    return arr;
}

function obtenerInfo(country) {
    getJSON(getSummaryUrl(country), insertInTable);
}

selectElement.onchange = function() {

    var paisSeleccionado = obtenerLocacion();
    pais = paisSeleccionado;
    if (paisSeleccionado === "undefined")
        alerta("Paso algo")
    else {
        if (paisSeleccionado != "All") {
            obtenerInfo(paisSeleccionado);
            cleanChart();
            drawChart();

        }
    }
}

function initGlobal() {
    obtenerInfo("All");
}