var jsonAllCountriesSummary;
const selectElement = document.getElementById("select");
getJSON(getURLCountries(), init);
populateSelect();

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

function getCountryNameFromSelect() {
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
    jsonAllCountriesSummary = JSON.parse(responseText)
    initGlobal();
}

function insertGlobal(responseText) {
    jsonSummary = JSON.parse(responseText)
    insertInCards(jsonSummary)
}

function populateSelect() {

    let allCountries = getAllCountries()
    for (let i = 0; i < allCountries.length; i++) {
        const country = allCountries[i];
        var opt = document.createElement("option");
        opt.innerHTML = country;
        selectElement.appendChild(opt);
    }
}

function obtenerInfo(country) {
    getJSON(getSummaryUrl(country), insertGlobal);
}

selectElement.onchange = function() {

    var paisSeleccionado = getCountryNameFromSelect();
    pais = paisSeleccionado;
    if (paisSeleccionado != "All") {
        obtenerInfoCountry(paisSeleccionado);
        cleanChart();
        drawChart();
    } else {
        initGlobal();
    }
}

function initGlobal() {
    obtenerInfo("All");
}

function obtenerInfoCountry(countryName) {
    for (let i = 0; i < jsonAllCountriesSummary.length; i++) {
        const element = jsonAllCountriesSummary[i];
        if (element.country == countryName) {
            insertInCards(element);
            break;
        }

    }
}

function insertInCards(country) {
    document.getElementById('deaths').innerHTML = formatNumber(country.deaths);
    document.getElementById('recovered').innerHTML = formatNumber(country.recovered);
    document.getElementById('confirmed').innerHTML = formatNumber(country.cases);
    document.getElementById('active').innerHTML = formatNumber(country.active);
    document.getElementById('tests').innerHTML = formatNumber(country.tests);
    document.getElementById('critical').innerHTML = formatNumber(country.critical);
}

function formatNumber(number) {
    return new Intl.NumberFormat("de-ES").format(number)
}