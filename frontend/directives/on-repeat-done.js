/**
 * Created by Jordi Aranda.
 * 15/07/14
 * <jordi.aranda@bsc.es>
 */

/**
 * Used to know when ng-repeat finishes over a list of items
 */

dssApp.directive('onRepeatDone', ['$timeout', function($timeout){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('repeatDone', element);
                }, 100);
            }
        }
    };
}]);
