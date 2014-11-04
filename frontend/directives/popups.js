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
                element.popover({
                    trigger: 'hover',
                    placement: 'right'
                });
        }
    };
}]);

dssApp.directive('popupDown', ['$timeout', function($timeout){
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs){
            element.popover({
                trigger: 'hover',
                placement: 'bottom'
            });
        }
    };
}]);



dssApp.directive('popupRightWithContent', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            element.popover({
                trigger: 'manual',
                placement: 'right',
                //template: 'frontend/partials/ta/popover.html'
                //content: attr.popoverContent
            });
            element.find('.noUi-handle').mouseover(function () {
                $timeout(function () {
                    element.popover('show');
                }, 300);
            }).mouseleave(function () {
                $timeout(function () {
                    element.popover('hide');
                }, 1000);
            });
        }
    }
}]);
