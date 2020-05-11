function drawChart() {
    var jsonDayOne = getJSON(getDayOneUrl(obtenerLocacion()));
    var table = onLoad();
    var newCasesTable = onLoadNewCases();
    populateChartConfirmed(table, jsonDayOne);
    populateChartNewCases(newCasesTable, jsonDayOne);
}

function populateArrayDayOne(jsonDayOne) {
    arrDayOne = [];
    isBeforeDayOne = true;
    for (var date in jsonDayOne.timeline.cases) {
        if (jsonDayOne.timeline.cases[date] != 0) {
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            isBeforeDayOne = false;
        }
        if (!isBeforeDayOne) {
            arrDayOne.push([date, jsonDayOne.timeline.cases[date]]);
        }
    }
    return arrDayOne;
}


function getJSON(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

function populateChartConfirmed(chart, jsonDayOne) {
    for (var date in jsonDayOne.timeline.cases) {
        var confirmed = jsonDayOne.timeline.cases[date];
        var thisDate = new Date(date);
        addPointToChart(chart, thisDate, confirmed);
    }
    chart.render();

}
/**
 * for (let i = 0; i < jsonDayOne.length; i++) {
    calculatePoint(chart, jsonDayOne, i);
    let date = new Date(jsonDayOne[i].Date);
    date.setDate(date.getDate() + 1);
    let totalDeaths = jsonDayOne[i].Deaths;
    console.log(totalDeaths);
    chart.options.data[1].dataPoints.push({
        x: date,
        y: totalDeaths
    });
 */


function populateChartNewCases(newCasesTable, jsonDayOne) {
    var arrDayOne = populateArrayDayOne(jsonDayOne);
    var firstDay = arrDayOne[0];
    addPointToChart(newCasesTable, new Date(firstDay[0]), firstDay[1]);

    for (let i = 1; i < arrDayOne.length; i++) {
        const currentDay = arrDayOne[i];
        let currentDate = new Date(currentDay[0]);
        const previousDayConfirmedCases = arrDayOne[i - 1][1];
        const currentDayNewCases = parseInt(currentDay[1]) - parseInt(previousDayConfirmedCases);
        addPointToChart(newCasesTable, currentDate, currentDayNewCases);
    }
    newCasesTable.render();
}




function addPointToChart(chart, x, y) {
    chart.options.data[0].dataPoints.push({
        x: x,
        y: y
    });
}


function onLoad() {

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "dark2",
        backgroundColor: "transparent",
        title: {
            text: "Evolution COVID-19"
        },
        axisX: {
            valueFormatString: "DD MMM",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY: {
            title: "Number of Cases",
            crosshair: {
                enabled: true
            }
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "bottom",
            horizontalAlign: "left",
            dockInsidePlotArea: true,
            itemclick: toogleDataSeries
        },
        data: [{
            type: "line",
            showInLegend: true,
            name: "Total Cases",
            lineDashType: "solid",
            lineColor: "#f5deb3",
            dataPoints: []
        }, {
            type: "line",
            showInLegend: true,
            name: "Total Deaths",
            lineDashType: "dash",
            lineColor: "#f5deb3",
            dataPoints: []
        }]
    });

    function toogleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }


    return chart;
}

function onLoadNewCases(params) {

    var chart = new CanvasJS.Chart("chartContainerNewCases", {
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: "transparent",
        title: {
            text: "Daily Cases"
        },
        axisX: {
            valueFormatString: "DD MMM",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY: {
            title: "Number of New Cases",
            crosshair: {
                enabled: true
            }
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "bottom",
            horizontalAlign: "left",
            dockInsidePlotArea: true,
            itemclick: toogleDataSeries
        },
        data: [{
            type: "line",
            showInLegend: true,
            name: "New Cases",
            lineDashType: "solid",
            lineColor: "#f5deb3",
            dataPoints: []
        }]
    });

    function toogleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }


    return chart;
}