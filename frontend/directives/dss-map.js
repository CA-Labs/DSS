/**
 * Created by Jordi Aranda.
 * 13/2/15
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('dssMap', [function(){
    return {
        restrict: 'E',
        scope: {
            treatmentName: '='
        },
        transclude: true,
        link: function(scope, element, attrs){

            // List of continents selected so far
            scope.continents = [];

            var width = 600;
            var height = 400;

            var svg = d3.select('.dss-map').append('svg')
                .attr('width', width)
                .attr('height', height);

            var projection = d3.geo.mercator()
                .scale(100)
                .translate([width / 2, height / 2])
                .precision(.1);

            var path = d3.geo.path()
                .projection(projection);

            var selectContinent = function(continent){
                d3.selectAll('.dss-continent')
                    .filter(function(d){ return d.properties.continent == continent })
                    .attr('selected', function(d,i){
                        return d3.selectAll('.dss-continent').filter(function(d){ return d.properties.continent == continent })[0][i].attributes.selected.value == 'true' ? false : true;
                    })
                    .classed('continent-selected', function(d,i){ return d3.selectAll('.dss-continent').filter(function(d){ return d.properties.continent == continent })[0][i].attributes.selected.value == 'true' })
                    .classed('continent-unselected', function(d,i) { return d3.selectAll('.dss-continent').filter(function(d){ return d.properties.continent == continent })[0][i].attributes.selected.value == 'false' })
            };

            d3.json('assets/continents.json', function(error, world) {
                if (error) {
                    return console.error(error);
                } else {
                    var countries = topojson.feature(world, world.objects.countries).features;
                    svg.selectAll('.continent')
                        .data(countries)
                        .enter()
                        .append('path')
                        .attr('id', function(d) { return d.id; })
                        .attr('class', function(d) { return 'dss-continent'; })
                        .attr('data-name', function(d) { return d.properties.continent; })
                        .attr('selected', false)
                        .attr('d', path)
                        .on('click', function(d) {
                            selectContinent(d.properties.continent);
                            var index = scope.continents.indexOf(d.properties.continent);
                            if (index == -1) {
                                scope.continents.push(d.properties.continent)
                            } else {
                                scope.continents.splice(index,1);
                            }
                            scope.$emit('newContinents', {treatmentName: scope.treatmentName, continents: scope.continents});
                        });
                }
            });

        }
    }
}]);
