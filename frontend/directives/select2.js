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

            // This is used to remove cached options in the select when no data has to be populated
            scope.$on('forceSelectUpdate', function($event, data){
                if (typeof data == 'undefined' || data.length == 0){
                    element.select2({
                        placeholder: 'Select a ' + attrs.selectfield
                    });
                }
            });

            $timeout(function(){
                element.select2({
                    placeholder: 'Select a ' + attrs.selectfield
                });
            });
        }
    };
}]);
