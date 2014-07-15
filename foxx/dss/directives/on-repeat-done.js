/**
 * Created by Jordi Aranda.
 * 15/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('onRepeatDone', function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$emit('repeatDone', element);
        }
    };
});
