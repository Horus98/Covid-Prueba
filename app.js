var api = "https://api.covid19api.com/summary";
var boton = document.getElementById("botonCalcular");
var input = document.getElementById("pais");
const miJson = getJSON(api);
function imprimir(cadena) {
  console.log(cadena);
}
function alerta(texto){
	Swal.fire({
		icon: 'error',
		title: 'Oops...',
		text: texto,
		timer: 2000,
		confirmButtonColor: '#d33',
		timerProgressBar: true,
	  })

}


function getJSON(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function obtenerInfo(miPais){
    var global = miJson.Global;
    var paises = miJson.Countries;
    var info = [];
    for (i in paises){
        if((paises[i].Country == miPais) || paises[i].Slug == miPais) {
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


boton.onclick = function() {
    if(input.value == "")
        alerta("Ingrese un pais valido")
    else {
        var pais = input.value;
        var arr = obtenerInfo(pais);
        mostrar(arr);
        input.value = "";   
    }
}

function mostrar(informacion){
    document.getElementById("info4").innerHTML =  informacion[0];
    document.getElementById("info5").innerHTML =  informacion[1];
    document.getElementById("info6").innerHTML =  informacion[2];
    document.getElementById("info1").innerHTML =  informacion[3];
    document.getElementById("info2").innerHTML =  informacion[4];
    document.getElementById("info3").innerHTML =  informacion[5];
}