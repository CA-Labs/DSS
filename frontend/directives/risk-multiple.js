/**
 * Created by Jordi Aranda.
 * 15/07/14
 * <jordi.aranda@bsc.es>
 */

/**
 * Used to initialize risk sliders values on startup.
 */
dssApp.directive('onRisksType', ['$timeout', function($timeout){
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs){
            $timeout(function(){
                scope.$emit('sliderValueChanged', {slider: $(element.children().eq(1)), value: $(element.children().eq(1)).val(), init: true, type: attrs.type, model: $(element).children().eq(1).data('model'), key: $(element).children().eq(1).data('hash-key')});
            }, 100);
        }
    };
}]);

