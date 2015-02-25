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
                        currentPath.push(_.clone(link));
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
                return links.filter(function(link){ return link.source.name == nodeName });
            };

            var pathContainingMitigatedRisk = function(path, risk, service){
                // TODO: What if the path has been hidden? no risk link will be found and it will be considered as unmitigated!
                // TODO: no clear work around
                var mitigatedRisk = false;
                _.each(path, function(link){
                    if(link.target.type == 'risk' && link.target.name == risk){
                        if(service.mitigatedRisks.indexOf(risk) !== -1){
                            mitigatedRisk = true;
                        }
                    }
                });
                return mitigatedRisk;
            };

            var toggleAll = function(d) {
                if (d.children) {
                    d.children.forEach(toggleAll);
                    toggle(d);
                }
            };

            // Toggle children.
            var toggle = function(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
            };

            // Retrieves a link by source and target names
            var getFromToLink = function(sourceName, targetName, links){
                var foundLink = _.filter(links, function(link){
                    return link.source.name == sourceName && link.target.name == targetName
                });
                return foundLink.length == 1 ? foundLink[0] : null;
            };

            /********************************************************************
             *********************** PARTY STARTS HERE **************************
             ********************************************************************/

            $timeout(function(){
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

                // Compute the new tree layout
                var root = buildFlowNodes();
                root.x0 = margin.left;
                root.y0 = width / 4.5;

                var nodes = tree.nodes(root).reverse();
                var links = tree.links(nodes);

                var i = 0;

                // First update is for risk mitigation detection
                buildProperNodesAndLinks();
                updateGraph(root);
                hideMitigatedPaths();

                // Graph ui-related updates
                function updateGraph(source) {

                    var duration = d3.event && d3.event.altKey ? 5000 : 500;

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

                    //console.log('new nodes', node.enter());

                    // Enter any new nodes at the parent's previous position
                    var nodeEnter = node.enter().append('g')
                        .attr('class', 'node')
                        .attr('transform', function (d) {
                            return 'translate(' + source.y0 + ',' + source.x0 + ')';
                        })
                        .on('click', function(d) {
                            toggle(d);
                            nodes = tree.nodes(root).reverse();
                            links = tree.links(nodes);
                            buildProperNodesAndLinks();
                            updateGraph(d);
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

                    //console.log('update nodes', node);

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

                    //console.log('removed nodes', node.exit());

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
                        .attr('class', function(d){ return d.mitigationClass + " link"})
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

                // Prepares nodes and links for graph plotting
                function buildProperNodesAndLinks() {

                    var selectedServices = CloudService.getServicesSelected();

                    // The user already selected some services, display mitigated/unmitigated risks in the tree
                    if(selectedServices !== null && typeof selectedServices !== 'undefined' && selectedServices.length > 0){

                        // Find all tree paths
                        var paths = findPaths(links);

                        var auxLinks = [];
                        // Iterate over paths found
                        _.each(paths, function(path){
                            // Retrieve the link ending to a Risk asset (some unmitigated risk might have no treatments)
                            var riskLink = path.filter(function(link){ return link.target.type == 'risk'; })[0];
                            if (riskLink) {
                                var riskMitigated = 0;
                                // Check if this link is contained in a path where the risk has been mitigated by some selected service
                                _.each(selectedServices, function(selectedService){
                                    if(pathContainingMitigatedRisk(path, riskLink.target.name, selectedService)) riskMitigated++;
                                });
                                _.each(path, function(link){
                                    var copy = _.clone(link);
                                    copy.mitigationClass = riskMitigated > 0 ? riskMitigated == selectedServices.length ? 'mitigation-all' : 'mitigation-some' : 'mitigation-none';
                                    auxLinks.push(copy);
                                });
                            }
                        });

                        // Modify original links
                        var linksIdsUsed = [];
                        _.each(links, function(link, index){
                            _.each(auxLinks, function(auxLink){
                                if(link.source.name == auxLink.source.name && link.target.name == auxLink.target.name){

                                    // Choose proper mitigation class (links might be contained within different paths of different mitigation nature)
                                    var duplicatedLinks = _.filter(auxLinks, function(duplicatedLink){
                                        return duplicatedLink.source.name == auxLink.source.name && duplicatedLink.target.name == auxLink.target.name;
                                    });

                                    // red, green, orange mitigation classes
                                    var reds = 0;
                                    var greens = 0;
                                    var oranges = 0;

                                    _.each(duplicatedLinks, function(duplicatedLink){
                                        if(duplicatedLink.mitigationClass == 'mitigation-all') {
                                            greens++;
                                        } else if(duplicatedLink.mitigationClass == 'mitigation-some') {
                                            oranges++;
                                        } else if(duplicatedLink.mitigationClass == 'mitigation-none') {
                                            reds++;
                                        }
                                    });

                                    if (reds > 0 && oranges == 0 && greens == 0) {
                                        auxLink.mitigationClass = 'mitigation-none';
                                    } else if (reds > 0 && (oranges > 0 || greens > 0)) {
                                        auxLink.mitigationClass = 'mitigation-some';
                                    } else if (reds == 0 && oranges > 0) {
                                        auxLink.mitigationClass = 'mitigation-some';
                                    } else if (greens > 0) {
                                        auxLink.mitigationClass = 'mitigation-all';
                                    }

                                    linksIdsUsed.push(link.source.name + "_" + link.target.name);
                                    links[index] = auxLink;
                                }
                            });
                        });

                    }

                    // Initialize mitigation class to empty value
                    _.each(links, function(link){
                        if(!link.mitigationClass) {
                            link.mitigationClass = 'mitigation-undefined';
                        }
                    });

                };

                // Hides mitigated paths
                function hideMitigatedPaths() {

                    // Checks whether a certain node is a child of some other node
                    var isChildFromNode = function(childNodeName, parentNodeName){

                        var parentObj = {value: false};

                        var isParent = function(parent, childNodeName){
                            if (parent.children){
                                _.each(parent.children, function(child){
                                    if (child.name == childNodeName) {
                                        parentObj.value = true;
                                    }
                                    else isParent(child, childNodeName);
                                });
                            }
                        };

                        var parentNode = _.filter(nodes, function(node){
                            return node.name == parentNodeName;
                        });
                        if (parentNode.length !== 1) return false;
                        parentNode = parentNode[0];

                        isParent(parentNode, childNodeName);
                        return parentObj.value;
                    };

                    // Auxiliar function that checks if there are unmitigated children links
                    var allMitigated = function (source, links) {
                        var mitigated = 0;
                        if (source.children) {
                            _.each(source.children, function (child) {
                                var link = getFromToLink(source.name, child.name, links);
                                if (link.mitigationClass == 'mitigation-all') mitigated++;
                            });
                            return mitigated == source.children.length;
                        } else {
                            return true;
                        }
                    };

                    var nodesNames = [];
                    _.each(links, function (link) {
                        var successorLinks = findLinksStartingByNode(links, link.source.name);
                        if (successorLinks.length == 1){
                            // There's only one successor link, just get this one into account
                            if (link.mitigationClass == 'mitigation-all' && allMitigated(link.target, links)) {
                                nodesNames.push(link.source.name);
                            }
                        } else if (successorLinks.length > 1){
                            // There's more than one successor link, check that all successor links are actually mitigated
                            var mitigated = 0;
                            _.each(successorLinks, function(successor){
                                if (successor.mitigationClass == 'mitigation-all' && allMitigated(successor.target, links)) mitigated++;
                            })
                            if (mitigated == successorLinks.length) nodesNames.push(link.source.name);
                        }
                    });

                    _.each(nodesNames, function(parentName){
                        _.each(nodesNames, function(childName){
                            if (childName != parentName){
                                nodes.forEach(function(d){
                                    if(d.name == childName && nodesNames.indexOf(childName) !== -1 && d.children){
                                        var canBeHidden = true;
                                        _.each(nodesNames, function(nodeName){
                                            if(isChildFromNode(childName, nodeName)){
                                                canBeHidden = false;
                                            }
                                        });

                                        if (canBeHidden){
                                            d._children = d.children;
                                            d.children = null;
                                            nodes = tree.nodes(root).reverse();
                                            links = tree.links(nodes);
                                            buildProperNodesAndLinks();
                                            updateGraph(d);
                                        }
                                    }
                                });
                            };
                        });
                    });
                };

            }, 100);
        }
    }
}]);
