/**
 * Created by Jordi Aranda.
 * 13/2/15
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('dssRadar', ['TreatmentsService', function(TreatmentService){
    return {
        restrict: 'E',
        scope: {
            characteristics: '='
        },
        link: function(scope, elem, attrs){
            var data = [
                {
                    axes: _.map(scope.characteristics, function (characteristic) {
                        return {axis: characteristic.name, value: characteristic.value}
                    })
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
