/**
 * Popups directive
 * @author: Jacek Dominiak
 * @copyright: Jacek Dominiak
 * @created: 22/09/14
 */

dssApp.directive('popupLeft', ['$timeout', function($timeout){
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs){
//            $timeout(function(){
                element.popover({
                    trigger: 'hover',
                    placement: 'left'
                });
//            });
        }
    };
}]);

dssApp.directive('popupRight', ['$timeout', function($timeout){
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs){
//            $timeout(function(){
                element.popover({
                    trigger: 'hover',
                    placement: 'right'
//                });
            });
        }
    };
}]);
