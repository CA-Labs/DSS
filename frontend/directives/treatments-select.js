/**
 * Created by Jordi Aranda.
 * 23/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('treatSelect', function() {
    return {
        restrict: 'E',
        scope: {
            item: '='
        },
        templateUrl: 'partials/treatments/treatments-select.html',
        link: function(scope, element, attrs){

            scope.options = scope.$eval("{" + scope.item.destination.options + "}");

            scope.change = function(treatment){
                var key = null;
                for(optionValue in scope.options){
                    if(scope.options[optionValue] == treatment){
                        key = optionValue;
                        break;
                    }
                }
                if(key){
                    scope.$emit('treatmentValueChanged', {name: scope.item.destination.name, value: key});
                }
            }
        }
    };
});
