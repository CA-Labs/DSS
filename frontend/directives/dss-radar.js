/**
 * Created by Jordi Aranda.
 * 13/2/15
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('dssRadar', ['TreatmentsService', function(TreatmentsService){
    return {
        restrict: 'E',
        scope: {
            characteristicsArray: '=',
            characteristics: '=',
            service: '='
        },
        link: function(scope, elem, attrs){

            // Datasets seem to be of same length, consider treatments not selected to have a value of 0 (does it make sense?)
            var treatmentsValues = TreatmentsService.getTreatmentsValues();
            var treatmentsAxes = [];
            var characteristicsAxes = [];

            // Characteristics array is used to assure characteristics are traversed in the same order
            _.each(scope.characteristicsArray, function(characteristicElement){
                _.each(scope.characteristics, function(characteristic){
                    if (characteristic.name == characteristicElement.name){
                        var value = 0;
                        _.each(treatmentsValues, function(treatmentValue, treatmentKey){
                            if (treatmentKey == characteristic.name){
                                if (treatmentKey == "Place of jurisdiction"){
                                    value = TreatmentsService.compareRegions(treatmentValue, scope.service.regions)
                                } else {
                                    value = treatmentValue;
                                }
                            }
                        });
                        treatmentsAxes.push({axis: characteristic.name, value: value});
                    }
                });
            });

            // Characteristics array is used to assure characteristics are traversed in the same order
            _.each(scope.characteristicsArray, function(characteristicElement){
                _.each(scope.characteristics, function (characteristic) {
                    if (characteristic.name == characteristicElement.name) {
                        var value = characteristic.value;
                        if (characteristic.name == "Place of jurisdiction") {
                            value = characteristic.value.length / characteristic.max;
                        }
                        characteristicsAxes.push({axis: characteristic.name, value: value});
                    }
                });
            });


            var data = [{axes: characteristicsAxes}, {axes: treatmentsAxes}];

            var chart = RadarChart.chart();
            chart.config({
                w: 500,
                h: 500,
                radius: 3
            });
            var svg = d3.select(elem[0]).append('svg')
                .attr('width', 500)
                .attr('height', 500);
            svg.append('g').classed('focus', 1).datum(data).call(chart);

        }
    }
}]);
