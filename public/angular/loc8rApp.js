angular.module('loc8rApp', []);

var _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var formatDistance = function () {
  return function (distance) {
    var numDistance, unit;
    if (distance && _isNumeric(distance)) {
      if (distance > 1) {
        numDistance = parseFloat(distance).toFixed(1);
        unit = 'km';
      }
      else {
        numDistance = parseInt(distance * 1000, 10);
        unit = 'm';
      }
      return numDistance + unit;
    }
    else {
      return '?';
    }
  }
};

var locationListCtrl = function ($scope, loc8rData) {
  loc8rData.then(function (data) {
    $scope.data = {
      locations: data.data
    };
  }).catch(function (e) {
    console.log(e);
  });
};

var ratingStars = function () {
  return {
    scope: {
      thisRating: '=rating'
    },
    templateUrl: '/html/rating-stars.html'
  };
};

var loc8rData = function ($http) {
  return $http.get('/api/locations?lng=-0.9630884&lat=51.451041&maxDistance=20');
}

angular
  .module('loc8rApp')
  .controller('locationListCtrl', locationListCtrl)
  .filter('formatDistance', formatDistance)
  .directive('ratingStars', ratingStars)
  .service('loc8rData', loc8rData);