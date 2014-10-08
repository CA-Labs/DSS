/**
 * Created by Jordi Aranda.
 * 18/09/14
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('select2', ['$timeout', function($timeout){
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs){
            $timeout(function(){
                element.select2({
                    placeholder: 'Select a treatment'
                });
            });
        }
    };
}]);
