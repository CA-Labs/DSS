/**
 * Created by Jordi Aranda.
 * 15/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('riskSlider', ['AssetsService', function(AssetsService){
    return {
        restrict: 'E',
        templateUrl: 'dss/partials/risks/slider.html',
        scope: {
            risk: '=',
            multiple: '='
        },
        link: {
            pre: function(scope, element, attrs){

                console.log('prelink in risk slider');
                scope.taAssets = AssetsService.getTA();
                scope.$watch('taAssets', function(newTaAssets, oldTaAssets){
                    //TODO: bla bla bla...
                }, true);

                //Auxiliar lists to track slider values
                scope.riskLikelihoodConsequenceMultiple = [];
                scope.riskLikelihoodConsequenceNotMultiple = [];

                //List of available categories to categorize risks level
                var CATEGORY = {
                    VERY_LOW: {
                        class: 'risk-very-low',
                        name: 'Very low'
                    },
                    LOW: {
                        class: 'risk-low',
                        name: 'Low'
                    },
                    NORMAL: {
                        class: 'risk-normal',
                        name: 'Normal'
                    },
                    HIGH: {
                        class: 'risk-high',
                        name: 'High'
                    },
                    VERY_HIGH: {
                        class: 'risk-very-high',
                        name: 'Very high'
                    }
                };

                //Auxiliar function to map scalar values to discrete ones (class names)
                var numberToCategoryClass = function(n){
                    if(n < 2 ) return CATEGORY.VERY_LOW.class;
                    if(n == 2 || n == 3) return CATEGORY.LOW.class;
                    if(n == 4 || n == 5 || n == 6) return CATEGORY.NORMAL.class;
                    if(n == 7 || n == 8) return CATEGORY.HIGH.class;
                    if(n > 8) return CATEGORY.VERY_HIGH.class;
                };

                //Auxiliar function to map scalar values to discrete ones (names)
                var numberToCategoryName = function(n){
                    if(n < 2 ) return CATEGORY.VERY_LOW.name;
                    if(n == 2 || n == 3) return CATEGORY.LOW.name;
                    if(n == 4 || n == 5 || n == 6) return CATEGORY.NORMAL.name;
                    if(n == 7 || n == 8) return CATEGORY.HIGH.name;
                    if(n > 8) return CATEGORY.VERY_HIGH.name;
                };

                //Auxiliar function to clear categories
                var removeClasses = function(domElement){
                    for(category in CATEGORY){
                        domElement.removeClass(CATEGORY[category].class);
                    }
                    return domElement;
                };

                var attributes = scope.$eval("{" + scope.risk.destination.attributes + "}");

                $(".def-tip").popover({
                    toggle: 'hover'
                });

                scope.a = 0;
                scope.b = 10;
                scope.c = 1;

                scope.$watch('myModel', function(newSliderValue, oldSliderValue){
                    console.log('Old was ' + oldSliderValue + ' and new is ' + newSliderValue);
                });

                /**

                 //When the user selects whether to specify risks per TA or as a whole, restart the likelihood/consequences model
                 scope.$on('riskTypeSelected', function(scope, element, riskType){
                //TODO: bla bla bla...
            });

                 //We can specify risks for each TA (scope.multiple == true)
                 scope.$on('repeatDone', function(scope, element, attrs){
                //Set very low class by default on initialization
                element.find("div.noUiSlider").prev().prev().siblings('span.requirement-value')
                    .addClass(CATEGORY.VERY_LOW.class)
                    .text(CATEGORY.VERY_LOW.name);

                return element.find("div.noUiSlider").noUiSlider({
                    range: { min: attributes.range[0], max: attributes.range[1] },
                    start: attributes.start || 0,
                    step: attributes.step || 1,
                    handles: attributes.handles || 1
                }).on({
                    slide: function() {
                        var domElement = $(this).prev().prev().siblings('span.requirement-value');
                        var currentValue = $(this).val();
                        return removeClasses(domElement)
                            .addClass(numberToCategoryClass(currentValue))
                            .text(numberToCategoryName(currentValue));
                    }
                });
            });

                 //We can only specify risks for each TA as a whole (scope.multiple == false)
                 if(!scope.multiple){
                //Set very low class by default on initialization
                element.find("div.noUiSlider").prev().prev().siblings('span.requirement-value')
                    .addClass(CATEGORY.VERY_LOW.class)
                    .text(CATEGORY.VERY_LOW.name);

                return element.find("div.noUiSlider").noUiSlider({
                    range: { min: attributes.range[0], max: attributes.range[1] },
                    start: attributes.start || 0,
                    step: attributes.step || 1,
                    handles: attributes.handles || 1
                }).on({
                    slide: function() {
                        var domElement = $(this).prev().prev().siblings('span.requirement-value');
                        var currentValue = $(this).val();
                        return removeClasses(domElement)
                            .addClass(numberToCategoryClass(currentValue))
                            .text(numberToCategoryName(currentValue));
                    }
                });
            }
                 */

            },
            post: function(){
                console.log('postlink in risk slider');
            }
        }
    };
}]);
