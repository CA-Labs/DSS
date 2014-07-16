/**
 * Created by Jordi Aranda.
 * 15/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('onRisksType', function(){
    return {
        restrict: 'A',
        scope: {},
        link: function(scope, element, attrs){
            var risksType = attrs.onRisksType;
            scope.$emit('riskTypeSelected', element, risksType);
        }
    };
});
