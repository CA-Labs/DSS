/**
 * Created by Jordi Aranda.
 * 24/10/14
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('dssGraph', ['d3Factory', 'AssetsService', 'RisksService', 'TreatmentsService', '$window', function(d3Factory, AssetsService, RisksService, TreatmentsService, $window){
    return {
        restrict: 'E',
        scope: {},
        link: function(scope, element, attrs){

            var buildNodes = function(){

                var bsoias = AssetsService.getBSOIA();
                var toias = AssetsService.getTOIA();
                var risks = RisksService.getRisks();
                var treatments = TreatmentsService.getTreatments();

                var bsoiaNames = bsoias.map(function(bsoia){ return bsoia.name; });
                var toiaNames = toias.map(function(toia){ return toia.asset.name; });
                var riskNames = risks.map(function(risk){ return risk.destination.name; });
                var treatmentNames = treatments.map(function(treatment){ return treatment.name});

                var data = {
                    name: 'DSS',
                    children: bsoiaNames.map(function(bsoia){
                        return {
                            name: bsoia,
                            expand: 'node-bsoia-expand',
                            collapse: 'node-bsoia-collapse',
                            children: AssetsService.getTOIAFromBSOIA(bsoia).filter(function(t){
                                return toiaNames.indexOf(t) !== -1;
                            }).map(function(toia){
                                return {
                                    name: toia,
                                    expand: 'node-toia-expand',
                                    collapse: 'node-toia-collapse',
                                    children: RisksService.getRisksFromTOIA(toia).filter(function(r){
                                        return riskNames.indexOf(r) !== -1;
                                    }).map(function(risk){
                                        return {
                                            name: risk,
                                            expand: 'node-risk-expand',
                                            collapse: 'node-risk-collapse',
                                            children: TreatmentsService.getTreatmentsFromRisk(risk).filter(function(treatment){
                                                return treatmentNames.indexOf(treatment) !== -1;
                                            }).map(function(treatment){
                                                return {
                                                    name: treatment,
                                                    expand: 'node-treatment-expand',
                                                    collapse: 'node-treatment-collapse',
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

                return data;

            };

            // Helper functions to expand/collapse tree nodes
            var toggle = function(node){
                if(node.children){
                    node._children = node.children;
                    node.children = null;
                } else {
                    node.children = node._children;
                    node._children = null;
                }
            };
            var togleAll = function(node){
                if(node.children){
                    node.children.forEach(togleAll);
                }
                toggle(node);
            };

            d3Factory.d3().then(function(d3){

                // Adapt graph size to current window width and height
                var modalWidth = $window.innerWidth * 0.75,
                    modalHeight = $window.innerHeight * 0.75;

                var margin = {
                    top: modalHeight * 0.03,
                    left: modalWidth * 0.03,
                    bottom: modalHeight * 0.03,
                    right: modalWidth * 0.03
                };

                var width = modalWidth - margin.left - margin.right,
                    height = modalHeight - margin.top - margin.bottom;

                // Set modal size dynamically depending on the dss graph size
                d3.select('.ngdialog-content')
                    .style('width', modalWidth + 'px')
                    .style('height', modalHeight + 'px');

                var diagonal = d3.svg.diagonal().projection(function(d){ return [d.y, d.x] });

                var tree = d3.layout.tree()
                    .size([width, height])
                    .separation(function(a, b) { return a.parent == b.parent ? 1 : 2 / a.depth });

                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                var root = buildNodes();
                root.x0 = margin.left;
                root.y0 = width / 4.5;
                var i = 0;

                update(root);

                function update(source){

                    var duration = d3.event && d3.event.altKey ? 5000 : 500;

                    // Compute the new tree layout
                    var nodes = tree.nodes(root).reverse(),
                        links = tree.links(nodes);

                    // Normalize for fixed depth
                    nodes.forEach(function(d) {
                        d.y = d.depth * (width / 4.5);    // We have up to 4 levels, divide by 4.5 to be sure all 4 levels fit within the area
                        d.x = d.x * height / width;
                    });

                    // Update the nodes
                    var node = svg.selectAll('g.node')
                        .data(nodes, function(d){ return d.id || (d.id = ++i) });

                    /************************************************************
                     *********************** NEW NODES **************************
                     ************************************************************/

                    // Enter any new nodes at the parent's previous position
                    var nodeEnter = node.enter().append('g')
                        .attr('class', 'node')
                        .attr('transform', function(d) { return 'translate(' + source.y0 + ',' + source.x0 + ')'; })
                        .on('click', function(d) { toggle(d); update(d); });

                    nodeEnter.append('circle')
                        .attr('r', 1e-6)
                        .attr('class', function(d){ return d._children ? d.collapse : d.expand ; });

                    nodeEnter.append('text')
                        .attr('x', function(d) { return -(d.name.length / 2.5) * 10 })
                        .attr('dy', '-1em')
                        .attr('text-anchor', function(d) { return 'start'; })
                        .text(function(d) { return d.name; })
                        .style('fill-opacity', 1e-6);

                    /************************************************************
                     ********************* UPDATE NODES *************************
                     ************************************************************/

                    // Transition nodes to their new position
                    var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; });

                    nodeUpdate.select('circle')
                        .attr('r', 10)
                        .attr('class', function(d) { return d._children ? d.collapse : d.expand; });

                    nodeUpdate.select('text')
                        .style('fill-opacity', 1);

                    /************************************************************
                     ********************* REMOVED NODES ************************
                     ************************************************************/

                    // Transition exiting nodes to the parent's new position
                    var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr('transform', function(d) { return 'translate(' + source.y + ',' + source.x + ')'; })
                        .remove();

                    nodeExit.select('circle')
                        .attr('r', 1e-6)
                        .remove();

                    nodeExit.select('text')
                        .style('fill-opacity', 1e-6)
                        .remove();

                    /************************************************************
                     ********************** UPDATE LINKS ************************
                     ************************************************************/

                    // Update the links
                    var link = svg.selectAll('path.link')
                        .data(links, function(d) { return d.target.id; });

                    /************************************************************
                     *********************** NEW LINKS **************************
                     ************************************************************/

                    // Enter any new links at the parent's previous position
                    link.enter().insert('path', 'g')
                        .attr('class', 'link')
                        .attr('d', diagonal);

                    // Enter any new links at the parent's previous position.
                    link.enter().insert('path', 'g')
                        .attr('class', 'link')
                        .attr('d', function(d) {
                            var o = {x: source.x0, y: source.y0};
                            return diagonal({source: o, target: o});
                        })
                        .transition()
                        .duration(duration)
                        .attr('d', diagonal);

                    // Transition links to their new position.
                    link.transition()
                        .duration(duration)
                        .attr('d', diagonal);

                    /************************************************************
                     ********************* REMOVED LINKS ************************
                     ************************************************************/

                    // Transition exiting nodes to the parent's new position.
                    link.exit().transition()
                        .duration(duration)
                        .attr('d', function(d) {
                            var o = {x: source.x, y: source.y};
                            return diagonal({source: o, target: o});
                        })
                        .remove();

                    // Stash the old positions for transition.
                    nodes.forEach(function(d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });

                }

            });
        }
    }
}]);
