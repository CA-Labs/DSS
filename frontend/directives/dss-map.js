/**
 * Created by Jordi Aranda.
 * 13/2/15
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('dssMap', [function(){
    return {
        restrict: 'E',
        scope: {},
        transclude: true,
        link: function(scope, element, attrs){
            var width = 1024;
            var height = 300;

            var svg = d3.select('.dss-map').append('svg')
                .attr('width', width)
                .attr('height', height);

            var projection = d3.geo.robinson()
                .translate([width / 2, height / 2]);

            d3.json('http://code.highcharts.com/mapdata/1.0.0/custom/world-continents.geo.json', function(error, world) {
                if (error) {
                    return console.error(error);
                } else {
                    var path = d3.geo.path().projection(projection);

                    var continents = svg.selectAll('.continent')
                        .data(world.features);

                    continents.enter().append('path')
                        .attr('id', function(d) { return d.id; })
                        .attr('data-continent', function(d) { return d.properties.name; })
                        .attr('class', function(d) { return 'dss-continent'; })
                        .attr('d', path)
                        .on('click', function(d){console.log('click on ' + d.properties.name)});
                }
            });
        }
    }
}]);
