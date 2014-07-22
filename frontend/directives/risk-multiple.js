/**
 * Created by Jordi Aranda.
 * 15/07/14
 * <jordi.aranda@bsc.es>
 */

/**
 * Directive used to initialize risk sliders values on startup.
 */
dssApp.directive('onRisksType', ['$timeout', function($timeout){
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs){
            $timeout(function(){
                scope.$emit('sliderValueChanged', {slider: $(element.children().first()), value: $(element.children().first()).val()});
            }, 10);
        }
    };
}]);
