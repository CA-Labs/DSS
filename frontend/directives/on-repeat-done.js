/**
 * Created by Jordi Aranda.
 * 15/07/14
 * <jordi.aranda@bsc.es>
 */

/**
 * Used to know when ng-repeat finishes over a list of items
 */

dssApp.directive('onRepeatDone', function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$emit('repeatDone', element);
        }
    };
});
