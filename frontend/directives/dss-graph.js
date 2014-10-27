/**
 * Created by Jordi Aranda.
 * 24/10/14
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('dssGraph', ['d3Factory', 'AssetsService', 'RisksService', 'TreatmentsService', function(d3Factory, AssetsService, RisksService, TreatmentsService){
    return {
        restrict: 'E',
        scope: {},
        link: function(scope, element, attrs){

            var buildNodes = function(){

                var bsoia = AssetsService.getBSOIA();
                var toia = AssetsService.getTOIA();
                var risks = RisksService.getRisks();
                var treatments = TreatmentsService.getTreatments();
                var treatmentNames = treatments.map(function(treatment){ return treatment.name});

                var data = {
                    name: 'DSS',
                    children: bsoia.map(function(bsoia){
                        return {
                            name: bsoia.name,
                            class: 'node-bsoia',
                            children: AssetsService.getTOIAFromBSOIA(bsoia.name).map(function(toia){
                                return {
                                    name: toia,
                                    class: 'node-toia',
                                    children: RisksService.getRisksFromTOIA(toia).map(function(risk){
                                        return {
                                            name: risk,
                                            class: 'node-risk',
                                            children: TreatmentsService.getTreatmentsFromRisk(risk).filter(function(treatment){
                                                return treatmentNames.indexOf(treatment) !== -1;
                                            }).map(function(treatment){
                                                return {
                                                    name: treatment,
                                                    class: 'node-treatment',
                                                    children: []
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                };

                // console.log(data);

                return data;

            };

            d3Factory.d3().then(function(d3){

                var margin = {top: parseInt(attrs.top),left: parseInt(attrs.left), bottom: parseInt(attrs.bottom), right: parseInt(attrs.right)},
                    width = parseInt(attrs.width) - margin.left - margin.right,
                    height = parseInt(attrs.height) - margin.top - margin.bottom;

                // Set modal size dynamically depending on the dss graph size
                d3.select('.ngdialog-content')
                    .style('height', height + 'px')
                    .style('width', width + 'px');

                var diagonal = d3.svg.diagonal().projection(function(d){ return [d.y, d.x] });

                var tree = d3.layout.tree()
                    .size([width, height])
                    .separation(function(a, b) { return a.parent == b.parent ? 1 : 2 / a.depth })

                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                var root = buildNodes();
                var i = 0;

                update(root);

                function update(source){

                    var nodes = tree.nodes(root).reverse(),
                        links = tree.links(nodes);

                    console.log('nodes', nodes);

                    // Normalize for fixed depth
                    nodes.forEach(function(d) {d.y = d.depth * 180 });

                    // Declare the nodes
                    var node = svg.selectAll('g.node')
                        .data(nodes, function(d){ return d.id || (d.id = ++i) });

                    // Enter the nodes
                    var nodeEnter = node.enter().append('g')
                        .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'});

                    nodeEnter.append('circle')
                        .attr('r', 10)
                        .attr('class', function(d){ return d.class; });


                    nodeEnter.append('text')
                        .attr('x', function(d) { return -(d.name.length / 2.5) * 10 })
                        .attr('dy', '-1em')
                        .attr('text-anchor', function(d) { return 'start'; })
                        .text(function(d) { return d.name; })
                        .style('fill-opacity', 1);

                    var link = svg.selectAll('path.link')
                        .data(links, function(d) { return d.target.id; });

                    link.enter().insert('path', 'g')
                        .attr('class', 'link')
                        .attr('d', diagonal);

                }

            });
        }
    }
}]);
