/**
 * Created by Jordi Aranda.
 * 13/2/15
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('dssRadar', ['TreatmentsService', function(TreatmentsService){
    return {
        restrict: 'E',
        scope: {
            characteristics: '='
        },
        link: function(scope, elem, attrs){
            // Datasets seem to be of same length, consider treatments not selected to have a value of 0 (does it make sense?)
            var treatmentsValues = TreatmentsService.getTreatmentsValues();
            var treatmentsAxes = [];
            _.each(scope.characteristics, function(characteristic){
                var value = 0;
                _.each(treatmentsValues, function(treatmentValue, treatmentKey){
                    if (treatmentKey == characteristic.name){
                        value = treatmentValue;
                    }
                });
                treatmentsAxes.push({axis: characteristic.name, value: value});
            });

            var data = [
                {
                    axes: _.map(scope.characteristics, function (characteristic) {
                        return {axis: characteristic.name, value: characteristic.value}
                    })
                },
                {
                    axes: treatmentsAxes
                }
            ];

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
