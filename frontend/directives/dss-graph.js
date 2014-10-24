/**
 * Created by Jordi Aranda.
 * 24/10/14
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('dssGraph', ['d3Factory', function(d3Factory){
    return {
        restrict: 'E',
        scope: {},
        link: function(scope, element, attrs){
            var data = [
                {
                    name: 'test',
                    parent: 'null',
                    children: [
                        {
                            name: 'a',
                            children: [
                                {name: 'b', size: 30},
                                {name: 'c', size: 30}
                            ]
                        }
                    ]
                }
            ];

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

                var root = data[0].children[0];
                var i = 0;

                update(root);

                function update(source){

                    var nodes = tree.nodes(root).reverse(),
                        links = tree.links(nodes);

                    // Normalize for fixed depth
                    nodes.forEach(function(d) {d.y = d.depth * 180 });

                    // Declare the nodes
                    var node = svg.selectAll('g.node')
                        .data(nodes, function(d){ return d.id || (d.id = ++i) });

                    // Enter the nodes
                    var nodeEnter = node.enter().append('g')
                        .attr('class', 'dss-node')
                        .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'});

                    nodeEnter.append("circle")
                        .attr("r", 10)

                    nodeEnter.append("text")
                        .attr("x", function(d) {
                            return d.children || d._children ? -13 : 13; })
                        .attr("dy", ".35em")
                        .attr("text-anchor", function(d) {
                            return d.children || d._children ? "end" : "start"; })
                        .text(function(d) { return d.name; })
                        .style("fill-opacity", 1);

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
