var app = angular.module("HervantaApp", ["leaflet-directive"]);

app.controller("MapCtrl", [ "$scope", "$http", "$timeout", "$filter", function ($scope, $http, $timeout, $filter) {
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

    $scope.currentStation = 522;
    $scope.currentTime = 1210;

    var stopIcon = {
        iconUrl: '/public/images/bus_stop.png',
        iconSize: [20, 20],
        shadowSize: [0, 0],
        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0]
    };
    var busIcon = {
        iconUrl: '/public/images/bus.png',
        iconSize: [64, 21],
        shadowSize: [0, 0],
        iconAnchor: [32, 10], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0]
    };
    var playerIcon = {
        iconUrl: '/public/images/player_icon.png',
        iconSize: [50, 57],
        shadowSize: [0, 0],
        iconAnchor: [25, 28], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0]
    };
    $scope.markers = [];
    var stationCoordinates = [];
    $http.get('/stations')
        .success(function (stations) {
            stations = stations.map(function (station) {
                stationCoordinates[station.id] = {lat: station.y, lng: station.x, name: station.name};
                return {lat: station.y, lng: station.x, message: station.name, icon: stopIcon};
            });
            $scope.markers = $scope.markers.concat(stations);
            $scope.player = stationCoordinates[$scope.currentStation];
            $scope.player.icon = playerIcon;
            $scope.player.zIndexOffset = 11;
            $scope.markers.push($scope.player);
            $scope.currentStationName = stationCoordinates[$scope.currentStation].name;
        });
    $scope.nextLines = [];

    $scope.selectLine = function (line) {
        $scope.currentStation = line.nextStop.StationId;
        $scope.currentTime = line.nextStop.Arrival;
        $scope.currentStationName = stationCoordinates[$scope.currentStation].name;
        $scope.player.lat = stationCoordinates[$scope.currentStation].lat;
        $scope.player.lng = stationCoordinates[$scope.currentStation].lng;
        fetchLines();
    };

//    var bus = {lat: 61.5, lng: 23.777599352282, icon: busIcon, zIndexOffset: 10};
//
//    var updateBus = function (t) {
//        bus.lng = bus.lng - t * 0.0001;
//        $timeout(function () {
//            updateBus(t + 1);
//        }, 1000);
//    };
//
//    updateBus(0);
//
//    $scope.markers.push(bus);

    $scope.paths = {};
    var fetchLines = function() {
        $scope.nextLines = [];
        $scope.paths = {};
        $http.get('/services?stationId=' + $scope.currentStation + '&time=' + $scope.currentTime)
            .success(function (timetable) {
                timetable.forEach(function (service) {
                    var latlngs = service.Stop.map(function (stop) {
                        return stationCoordinates[stop.StationId];
                    });
                    for (var i = 0; i < service.Stop.length - 1; i++) {
                        if (service.Stop[i].StationId == $scope.currentStation) {
                            $scope.nextLines.push({
                                name: service.ServiceNbr[0].ServiceNbr,
                                time: service.Stop[i].Arrival,
                                nextStop: service.Stop[i + 1]
                            });
                        }
                    }
                    $scope.paths['p' + service.ServiceId] = {
                        color: '#008000',
                        weight: 3,
                        latlngs: latlngs
                    };
                });
                $scope.nextLines = $filter('orderBy')($scope.nextLines, 'time');
            });
    }
    fetchLines();

}]);