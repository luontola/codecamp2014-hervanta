var app = angular.module("HervantaApp", ["leaflet-directive"]);

app.controller("MapCtrl", [ "$scope", "$http", function ($scope, $http) {
    angular.extend($scope, {
        defaults: {
            tileLayer: "https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png",
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'examples.map-i86knfo3'
        },
        tampere: {
            lat: 61.50,
            lng: 23.76,
            zoom: 13
        }
    });
    var icon = {
        iconUrl: '/public/images/bus_stop.png',
        iconSize: [20, 20],
        shadowSize: [0, 0],
        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0]
    };
    $scope.markers = [];
    $http.get('/stations')
        .success(function (stations) {
            stations = stations.map(function (station) {
                return {lat: station.y, lng: station.x, message: station.name, icon: icon};
            });
            $scope.markers = stations;
        });
    $scope.nextLines = [];
    for (var i = 0; i < 15; i++) {
        $scope.nextLines.push({name: i});
    }

}]);