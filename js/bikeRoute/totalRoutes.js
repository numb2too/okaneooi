const bikeRouteJsonData = [];

fetch('js/bikeRoute/route1.js')
    .then(response => response.text())
    .then(data => {
        bikeRouteJsonData.push(data);
    })