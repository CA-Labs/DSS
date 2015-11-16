/**
 * Star rating directive
 * @author: Jacek Dominiak
 * @created: 16/11/15
 */

dssApp.directive('starRating',['$rootScope', function ($rootScope) {
    console.log('starRating called');
    return {
        restrict: 'A',
        template: '<ul class="rating"><li ng-repeat="star in stars" ng-class="star">\u2605</li></ul>',
        scope: {
            value: '='
        },
        link: function (scope, elem, attrs) {
            console.log('score value', scope.value);

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < 5; i++) {
                    scope.stars.push({
                        filled: i < scope.value
                    });
                }
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
}]);