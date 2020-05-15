var jsonAllCountriesSummary;
var allCountries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Caribbean Netherlands", "Cayman Islands", "Central African Republic", "Chad", "Channel Islands", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Côte d'Ivoire", "DRC", "Denmark", "Diamond Princess", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "MS Zaandam", "Macao", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Réunion", "S. Korea", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin", "Saint Pierre Miquelon", "Saint Vincent and the Grenadines", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten", "Slovakia", "Slovenia", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "St. Barth", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Trinidad and Tobago", "Tunisia", "Turkey", "Turks and Caicos Islands", "UAE", "UK", "USA", "Uganda", "Ukraine", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"];
const urlCountries = "https://corona.lmao.ninja/v2/countries";
const urlGlobalSummary = "https://disease.sh/v2/all?yesterday=false";
var input = document.getElementById("pais");
const selectElement = document.getElementById("select");
getJSON(urlCountries, init);
populateSelect();


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
    jsonAllCountriesSummary = JSON.parse(responseText)
    initGlobal();

}

function insertGlobal(responseText) {
    jsonSummary = JSON.parse(responseText)
    insertInCards(jsonSummary)
}


function populateSelect() {
    for (let i = 0; i < allCountries.length; i++) {
        const country = allCountries[i];
        var opt = document.createElement("option");
        opt.innerHTML = country;
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
    getJSON(getSummaryUrl(country), insertGlobal);
}

selectElement.onchange = function() {

    var paisSeleccionado = obtenerLocacion();
    pais = paisSeleccionado;
    if (paisSeleccionado === "undefined")
        alerta("Paso algo")
    else {
        if (paisSeleccionado != "All") {
            obtenerInfoCountry(paisSeleccionado);
            cleanChart();
            drawChart();
        } else {
            initGlobal();
        }
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
    document.getElementById('deaths').innerHTML = new Intl.NumberFormat("de-ES").format(country.deaths);
    document.getElementById('recovered').innerHTML = new Intl.NumberFormat("de-ES").format(country.recovered);
    document.getElementById('confirmed').innerHTML = new Intl.NumberFormat("de-ES").format(country.cases);
    document.getElementById('active').innerHTML = new Intl.NumberFormat("de-ES").format(country.active);
    document.getElementById('tests').innerHTML = new Intl.NumberFormat("de-ES").format(country.tests);
    document.getElementById('critical').innerHTML = new Intl.NumberFormat("de-ES").format(country.critical);
}