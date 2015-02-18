/**
 * Created by Jordi Aranda.
 * 24/10/14
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('dssGraph', ['AssetsService', 'RisksService', 'TreatmentsService', 'CloudService', '$window', '$timeout', function(AssetsService, RisksService, TreatmentsService, CloudService, $window, $timeout){
    return {
        restrict: 'E',
        scope: {},
        link: function(scope, element, attrs){

            var buildFlowNodes = function(){

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
                            type: 'bsoia',
                            expand: 'node-bsoia-expand',
                            collapse: 'node-bsoia-collapse',
                            children: AssetsService.getTOIAFromBSOIA(bsoia).filter(function(t){
                                return toiaNames.indexOf(t) !== -1;
                            }).map(function(toia){
                                return {
                                    name: toia,
                                    type: 'toia',
                                    expand: 'node-toia-expand',
                                    collapse: 'node-toia-collapse',
                                    children: RisksService.getRisksFromTOIA(toia).filter(function(r){
                                        return riskNames.indexOf(r) !== -1;
                                    }).map(function(risk){
                                        return {
                                            name: risk,
                                            type: 'risk',
                                            expand: 'node-risk-expand',
                                            collapse: 'node-risk-collapse',
                                            children: TreatmentsService.getTreatmentsFromRisk(risk).filter(function(treatment){
                                                return treatmentNames.indexOf(treatment) !== -1;
                                            }).map(function(treatment){
                                                return {
                                                    name: treatment,
                                                    type: 'treatment',
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

            // Helper functions to generate tree paths given the links list
            var findPaths = function(links){
                var sortedLinks = _.clone(links.sort(function(a, b){ return a.source.depth - b.source.depth }));
                var aux = _.clone(sortedLinks);
                var paths = [];
                _.each(sortedLinks, function(link, index){
                    // Every single path will start from a BSOIA node
                    //console.log('LINK', index, link);
                    aux.shift();
                    var currentPath = [];
                    if (link.source.type == 'bsoia') {
                        // Add this first edge to the current path
                        currentPath.push(link);
                        //console.log('CURRENT PATH', _.clone(currentPath));
                        // Use a stack to push unvisited children edges (depth search)
                        var stackToVisit = [];
                        // Find next edges to visit and add them to the queue
                        var children = findLinksStartingByNode(aux, link.target.name);
                        //console.log('CHILDREN', children)
                        // This is actually the end of the path
                        if(children.length == 0) {
                            //console.log('PATH FOUND!', currentPath);
                            paths.push(currentPath);
                        } else {
                            _.each(children, function(child){ stackToVisit.push(child)});
                            while(stackToVisit.length > 0){
                                //console.log('STACK', _.clone(stackToVisit));
                                var currentLink = stackToVisit.pop();
                                // This is necessary to navigate backwards when some branch has already been visited
                                while (currentLink.source.name == currentPath[currentPath.length-1].source.name) {
                                    currentPath.pop();
                                }
                                currentPath.push(currentLink);
                                //console.log('CURRENT PATH', _.clone(currentPath));
                                var children = findLinksStartingByNode(aux, currentLink.target.name);
                                //console.log('CHILDREN', children)
                                if(children.length == 0){
                                    // This means we are on the last edge of a path, store the path
                                    paths.push(_.clone(currentPath));
                                    //console.log('PATH FOUND!', _.clone(currentPath));
                                    // Remove last edge added to continue with a different path
                                    currentPath.pop();
                                } else {
                                    _.each(children, function(child){ stackToVisit.push(child)});
                                }
                            }
                        }
                    }
                });
                return paths;
            };
            var findLinksStartingByNode = function(links, nodeName){
                // console.log('nodeName', nodeName);
                return links.filter(function(link){ return link.source.name == nodeName });
            };
            var pathContainingMitigatedRisk = function(path, risk, service){
                var mitigatedRisk = false;
                _.each(path, function(link){
                    if(link.source.type == 'risk' && link.source.name == risk){
                        if(service.mitigatedRisks.indexOf(risk) !== -1){
                            mitigatedRisk = true;
                        }
                    }
                });
                return mitigatedRisk;
            };

            /********************************************************************
             *********************** PARTY STARTS HERE **************************
             ********************************************************************/

            $timeout(function(){
                // Adapt graph size to current window width and height
                var modalWidth = $window.innerWidth * 0.75,
                    modalHeight = $window.innerHeight * 0.75;

                console.log('modalWidth', 'modalHeight', modalWidth, modalHeight);

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

                var root = buildFlowNodes();
                root.x0 = margin.left;
                root.y0 = width / 4.5;
                var i = 0;

                update(root);

                function update(source) {

                    var selectedServices = CloudService.getServicesSelected();

                    var duration = d3.event && d3.event.altKey ? 5000 : 500;

                    // Compute the new tree layout
                    var nodes = tree.nodes(root).reverse(),
                        links = tree.links(nodes);
                    // Initialize mitigation class to empty value
                    _.each(links, function(link){ link.mitigationClass = "mitigation-undefined"} );

                    // The user already selected some services, display mitigated/unmitigated risks in the tree
                    if(selectedServices !== null && typeof selectedServices !== 'undefined' && selectedServices.length > 0){
                        // Find all tree paths
                        var paths = findPaths(links);
                        //console.log('Computed paths', paths);
                        var auxLinks = [];
                        // Iterate over paths found
                        _.each(paths, function(path){
                            // Retrieve the link starting from a Risk asset
                            var riskLink = path.filter(function(link){ return link.source.type == 'risk'; })[0];
                            if (riskLink) {
                                //console.log('RISK LINK', riskLink);
                                var riskMitigated = 0;
                                // Check if this link is contained in a path where the risk has been mitigated by some selected service
                                _.each(selectedServices, function(selectedService){
                                    if(pathContainingMitigatedRisk(path, riskLink.source.name, selectedService)){
                                        riskMitigated++;
                                    }
                                });
                                _.each(path, function(link){
                                    link.mitigationClass = riskMitigated > 0 ? riskMitigated == selectedServices.length ? 'mitigation-all' : 'mitigation-some' : 'mitigation-none';
                                    auxLinks.push(link);
                                });
                            } else {
                                //console.error("No risk link found in path!", path);
                            }
                        });

                        //console.log('Original links', links);

                        // Modify original links
                        var linksIdsUsed = [];
                        _.each(links, function(link, index){
                            _.each(auxLinks, function(auxLink){
                                if(link.source.name == auxLink.source.name && link.target.name == auxLink.target.name && !linksIdsUsed.indexOf(link.target.id)){
                                    linksIdsUsed.push(link.target.id);
                                    links[index] = auxLink
                                }
                            });
                        });

                        //console.log('Modified links', links)
                    }

                    // Normalize for fixed depth
                    nodes.forEach(function (d) {
                        d.y = d.depth * (width / 4.5);    // We have up to 4 levels, divide by 4.5 to be sure all 4 levels fit within the area
                        d.x = d.x * height / width;
                    });

                    // Update the nodes
                    var node = svg.selectAll('g.node')
                        .data(nodes, function (d) {
                            return d.id || (d.id = ++i);
                        });

                    /************************************************************
                     *********************** NEW NODES **************************
                     ************************************************************/

                    // Enter any new nodes at the parent's previous position
                    var nodeEnter = node.enter().append('g')
                        .attr('class', 'node')
                        .attr('transform', function (d) {
                            return 'translate(' + source.y0 + ',' + source.x0 + ')';
                        });

                    nodeEnter.append('circle')
                        .attr('r', 1e-6)
                        .attr('class', function (d) {
                            return d._children ? d.collapse : d.expand;
                        });

                    nodeEnter.append('text')
                        .attr('x', function (d) {
                            return -(d.name.length / 2.5) * 10
                        })
                        .attr('dy', '-1em')
                        .attr('text-anchor', function (d) {
                            return 'start';
                        })
                        .text(function (d) {
                            return d.name;
                        })
                        .style('fill-opacity', 1e-6);

                    /************************************************************
                     ********************* UPDATE NODES *************************
                     ************************************************************/

                    // Transition nodes to their new position
                    var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr('transform', function (d) {
                            return 'translate(' + d.y + ',' + d.x + ')';
                        });

                    nodeUpdate.select('circle')
                        .attr('r', 10)
                        .attr('class', function (d) {
                            return d._children ? d.collapse : d.expand;
                        });

                    nodeUpdate.select('text')
                        .style('fill-opacity', 1);

                    /************************************************************
                     ********************* REMOVED NODES ************************
                     ************************************************************/

                    // Transition exiting nodes to the parent's new position
                    var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr('transform', function (d) {
                            return 'translate(' + source.y + ',' + source.x + ')';
                        })
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
                        .data(links, function (d) {
                            return d.target.id;
                        });

                    /************************************************************
                     *********************** NEW LINKS **************************
                     ************************************************************/

                        // Enter any new links at the parent's previous position.
                    link.enter().insert('path', 'g')
                        .attr('class', 'link')
                        .attr('class', function(d){ return d.mitigationClass})
                        .attr('d', function (d) {
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
                        .attr('d', function (d) {
                            var o = {x: source.x, y: source.y};
                            return diagonal({source: o, target: o});
                        })
                        .remove();

                    // Stash the old positions for transition.
                    nodes.forEach(function (d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });

                }
            }, 100);
        }
    }
}]);
