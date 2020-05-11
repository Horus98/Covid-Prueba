var urlApiDayOne = "https://api.covid19api.com/total/dayone/country/";

function drawChart() {
    var jsonDayOne = getJSON(urlApiDayOne);
    var table = onLoad();
    var newCasesTable = onLoadNewCases();
    populateChartConfirmed(table, jsonDayOne);
    populateChartNewCases(newCasesTable, jsonDayOne);
}


function getJSON(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

function populateChartConfirmed(chart, jsonDayOne) {
    for (let i = 0; i < jsonDayOne.length; i++) {
        calculatePoint(chart, jsonDayOne, i);
    }
    chart.render();
}

function populateChartNewCases(newCasesTable, jsonDayOne) {
    calculatePoint(newCasesTable, jsonDayOne, 0);
    for (let i = 1; i < jsonDayOne.length; i++) {
        const currentDay = jsonDayOne[i];
        let currentDate = calculateDate(currentDay);
        const previousDayConfirmedCases = jsonDayOne[i - 1].Confirmed;
        const currentDayNewCases = parseInt(currentDay.Confirmed) - parseInt(previousDayConfirmedCases);
        addPointToChart(newCasesTable, currentDate, currentDayNewCases);
    }
    newCasesTable.render();
}

function calculatePoint(chart, jsonDayOne, index) {
    const day = jsonDayOne[index];
    let date = new Date(day.Date);
    date.setDate(date.getDate() + 1);
    let confirmed = day.Confirmed;
    addPointToChart(chart, date, confirmed);
}

function addPointToChart(chart, x, y) {
    chart.options.data[0].dataPoints.push({
        x: x,
        y: y
    });
}

function calculateDate(day) {
    let date = new Date(day.Date);
    date.setDate(date.getDate() + 1);
    return date;
}

function onLoad() {

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "dark1",
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
            text: "Dayly Cases"
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