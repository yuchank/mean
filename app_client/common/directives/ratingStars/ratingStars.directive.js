(function () {
  angular
    .module('loc8rApp')
    .directive('ratingStars', ratingStars);

  function ratingStars() {
    return {
      restrict: 'EA',   // E:element A:attribute C:class M:comment
      scope: {
        thisRating: '=rating'
      },
      templateUrl: '/common/directives/ratingStars/ratingStars.template.html'
    };
  }
})();