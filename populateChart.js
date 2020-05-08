var urlApiDayOne = "https://api.covid19api.com/total/dayone/country/";

function drawChart() {
    var jsonDayOne = getJSON(urlApiDayOne);
    var table = onLoad();
    populateChart(table, jsonDayOne);
}


function getJSON(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

function populateChart(chart, jsonDayOne) {
    for (let i = 0; i < jsonDayOne.length; i++) {
        const day = jsonDayOne[i];
        let date = new Date(day.Date);
        date.setDate(date.getDate() + 1);
        let confirmed = day.Confirmed;
        chart.options.data[0].dataPoints.push({
            x: date,
            y: confirmed
        });
    }
    chart.render();
}

function onLoad() {

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: "#161616",
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