(function () {
  angular
    .module('loc8rApp')
    .controller('locationDetailCtrl', locationDetailCtrl);
  
  locationDetailCtrl.$inject = ['$routeParams', 'loc8rData'];
  function locationDetailCtrl($routeParams, loc8rData) {
    var vm = this;
    vm.locationid = $routeParams.locationid;

    loc8rData.locationById(vm.locationid).then(function (data) {
      console.log(data.data.name);
      vm.data = { location: data.data };
      vm.pageHeader = {
        title: vm.data.location.name
      };
    }).catch(function (e) {
      console.log(e);
    })
  }
})();