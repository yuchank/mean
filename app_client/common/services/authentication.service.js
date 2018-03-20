(function () {
  angular
    .module('loc8rApp')
    .service('authentication', authentication);

  authentication.$inject = ['$http', '$window'];
  function authentication($http, $window) {
    
    var saveToken = function (token) {
      $window.localStorage['loc8r-token'] = token;
    };

    var getToken = function () {
      return $window.localStorage['loc8r-token'];
    }

    var register = function (user) {
      return $http.post('/api/register', user).success(function (data) {
        saveToken(data.token);
      });
    };

    var login = function (user) {
      return $http.post('/api/login', user).success(function (data) {
        saveToken(data.token);
      });
    };

    var logout = function () {
      $window.localStorage.removeItem('loc8r-token');
    };

    var isLoggedIn = function () {
      var token = getToken();

      if (token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000; // in sec.
      }
      else {
        return false;
      }
    };

    var currentUser = function () {
      if (isLoggedIn()) {
        var token = getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return {
          email: payload.email,
          name: payload.name
        };
      }
    };

    return {
      saveToken: saveToken,
      getToken: getToken,
      register: register,
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn
    };
  };
})();