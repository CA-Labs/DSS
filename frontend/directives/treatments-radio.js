/**
 * Created by Jordi Aranda.
 * 23/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('treatRadio', function() {
    return {
        restrict: 'E',
        scope: {
            item: '='
        },
        templateUrl: 'partials/treatments/treatments-radio.html',
        link: function(scope, element, attrs){

            scope.options = scope.$eval("{" + scope.item.destination.options + "}");

            scope.aux = '';     //Used as a hack in dynamic radio buttons, since they create their own scope

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
