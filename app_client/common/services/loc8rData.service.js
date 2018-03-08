(function () {
  angular
    .module('loc8rApp')
    .service('loc8rData', loc8rData);

  loc8rData.$inject = ['$http'];
  function loc8rData($http) {
    var locationByCoords = function (lat, lng) {
      lat = 37.5693906;
      lng = 126.82793319999999;
      return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=20');  
    };
    var locationById = function (locationid) {
      return $http.get('/api/locations/' + locationid);
    };
    return {
      locationByCoords: locationByCoords,
      locationById: locationById
    };
  }
})();