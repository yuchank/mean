(function () {
  angular
    .module('loc8rApp')
    .filter('safeHtml', safeHtml);

  safeHtml.$inject = ['$sce'];
  function safeHtml($sce) {
    return function (val) {
      return $sce.trustAsHtml(val);
    }
  }
})();