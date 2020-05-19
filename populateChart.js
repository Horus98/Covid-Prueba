var chartGlobal;
var chartGlobalNewCases;

function drawChart() {
    getJSON(getDayOneUrl(getCountryNameFromSelect()), initCharts);

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
            var confirmed = jsonDayOne.timeline.cases[date]
            var deaths = jsonDayOne.timeline.deaths[date]
            arrDayOne.push([date, confirmed, deaths]);
        }
    }
    return arrDayOne;
}

function initCharts(responseText) {
    const jsonDayOne = JSON.parse(responseText);
    var table = onLoad();
    var newCasesTable = onLoadNewCases();
    populateChartConfirmed(table, jsonDayOne);
    populateChartNewCases(newCasesTable, jsonDayOne);
}

function populateChartConfirmed(chart, jsonDayOne) {
    var arrDayOne = populateArrayDayOne(jsonDayOne);
    for (let i = 0; i < arrDayOne.length; i++) {
        const day = arrDayOne[i];
        var thisDate = new Date(day[0]);
        var confirmed = day[1];
        var deaths = day[2];
        addPointToChart(chart, thisDate, confirmed, 0);
        chart.data.datasets[1].data.push(deaths);
        chart.update();
    }

}

function populateChartNewCases(newCasesTable, jsonDayOne) {
    var arrDayOne = populateArrayDayOne(jsonDayOne);
    var firstDay = arrDayOne[0];
    addPointToChart(newCasesTable, new Date(firstDay[0]), firstDay[1], 0);
    newCasesTable.data.datasets[1].data.push(firstDay[2]);
    for (let i = 1; i < arrDayOne.length; i++) {
        const currentDay = arrDayOne[i];
        let currentDate = new Date(currentDay[0]);
        const previousDayConfirmedCases = arrDayOne[i - 1][1];
        let currentDayNewCases = parseInt(currentDay[1]) - parseInt(previousDayConfirmedCases);
        currentDayNewCases = (currentDayNewCases < 0) ? 0 : currentDayNewCases;
        addPointToChart(newCasesTable, currentDate, currentDayNewCases, 0);

        const previousDayDeaths = arrDayOne[i - 1][2]
        let currentDayNewDeaths = parseInt(currentDay[2]) - parseInt(previousDayDeaths);
        currentDayNewDeaths = (currentDayNewCases < 0) ? 0 : currentDayNewDeaths
        newCasesTable.data.datasets[1].data.push(currentDayNewDeaths);
        newCasesTable.update();
    }

}

function addPointToChart(chart, x, y, index) {
    chart.data.labels.push(x.toLocaleDateString());
    chart.data.datasets[index].data.push(y);
}


function onLoad() {
    var config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "Confirmed",
                backgroundColor: "#FFC107",
                borderColor: "#FFC107",
                data: [],
                pointRadius: 0,
                fill: false,
            }, {
                label: "Deaths",
                backgroundColor: "#DC3545",
                borderColor: "#DC3545",
                data: [],
                pointRadius: 0,
                fill: false,
            }]
        },
        options: {
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Historical Confirmed',
                fontColor: "#FFFFFF",
                fontSize: "15"
            },
            tooltips: {
                position: 'nearest',
                mode: 'index',
                intersect: false,
                bodyFontSize: 16,
                titleFontSize: 16,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Day'
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 11
                    },
                    gridLines: {
                        zeroLineColor: '#7d828a'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    },
                    gridLines: {
                        zeroLineColor: '#7d828a'
                    }
                }]
            },
        }
    };

    var ctx = document.getElementById("canvas").getContext("2d");
    chart = new Chart(ctx, config);
    chartGlobal = chart;
    return chart;
}

function onLoadNewCases() {
    var config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "New Cases",
                backgroundColor: "#FFC107",
                borderColor: "#FFC107",
                data: [],
                pointRadius: 0,
                fill: false,
            }, {
                label: "New Deaths",
                backgroundColor: "#DC3545",
                borderColor: "#DC3545",
                data: [],
                pointRadius: 0,
                fill: false,
            }]
        },
        options: {
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'New Cases Per Day',
                fontColor: "#FFFFFF",
                fontSize: "15"
            },
            tooltips: {
                position: 'nearest',
                mode: 'index',
                intersect: false,
                bodyFontSize: 16,
                titleFontSize: 16,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Day'
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 11
                    },
                    gridLines: {
                        zeroLineColor: '#7d828a'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    },
                    gridLines: {
                        zeroLineColor: '#7d828a'
                    }
                }]
            },
        }
    };

    var ctx = document.getElementById("canvasNewCases").getContext("2d");
    chart = new Chart(ctx, config);
    chartGlobalNewCases = chart;
    return chart;

}

window.onresize = function() {
    chartGlobal.update()
    chartGlobalNewCases.update()
}

function cleanChart() {
    try {
        chartGlobal.data.labels = [];
        chartGlobal.data.datasets.pop();
        chartGlobal.data.datasets.pop();
        chartGlobalNewCases.data.labels = [];
        chartGlobalNewCases.data.datasets.pop();
        chartGlobalNewCases.data.datasets.pop();
    } catch (error) {
        console.log(error)
    }


}