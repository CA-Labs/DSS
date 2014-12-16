/**
 * This script gets executed on app startup.
 * Its main function is collections/graph initialization.
 **/

var console         = require('console'),
    arangodb        = require('org/arangodb'),
    db              = arangodb.db,
    graphs          = require('org/arangodb/general-graph'),
    aqlfunctions    = require('org/arangodb/aql/functions');

/*****************************************************************************
 **************************** DATABASE MANAGEMENT ****************************
 *****************************************************************************/

//Check if bsoia collection exists
if(db._collection('nodes') === null) {
    console.log('Creating nodes collection "nodes" in "dss" database...');
	db._createDocumentCollection('nodes');
    //Create unique index in name property
    db._collection('nodes').ensureUniqueConstraint('name');
} else {
    console.log('Collection "nodes" already exists, nothing to do here...');
}

//Check if dss_edges collection exists
if(db._collection('relations') === null){
    console.log('Creating edges collection "relations"...');
    db._createEdgeCollection('relations');
} else {
    console.log('Collection "relations" already exists, nothing to do here...');
}

//Check if graph exists (if not, create it from dss_edges/dss_nodes collections)
var available_graphs = graphs._list();

if(available_graphs.indexOf('dssBlueprints') == -1){
    console.log('Graph "dssBlueprints" does not exist, creating it from "edges" definition and documents collections...');
    graphs._create("dss", [graphs._directedRelation('edges', 'nodes', 'nodes')], []);
} else {
    console.log("Graph 'dssBlueprints' exists already, nothing to do here...");
}

/*****************************************************************************
 **************************** AQL CUSTOM FUNCTIONS ***************************
 *****************************************************************************/

/**
 * Returns service edges connected to the metric (1..*)
 */
//aqlfunctions.register('dss::graph::serviceEdgesFromMetric', function(metricName){
//    var db = require('internal').db;
//    var console = require('console');
//    console.info('Calling custom AQL function dss::graph::serviceEdgesFromMetric...');
//    var metric = db._collection('metric').firstExample('name',metricName);
//    return db._collection('edges').outEdges(metric);
//}, false);

/**
 * Returns service edge connected to the metric (1..1)
 */
//aqlfunctions.register('dss::graph::serviceEdgeFromMetric', function(metricName, serviceName){
//    var db = require('internal').db;
//    var console = require('console');
//    console.info('Calling custom AQL function dss::graph::serviceEdgeFromMetric...');
//    var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1})' +
//        'let sourceType = (p.source.type)' +
//        'let sourceName = (p.source.name)' +
//        'let destinationType = (p.destination.type)' +
//        'let destinationName = (p.destination.name)' +
//        'filter (sourceType == "metric") && (sourceName == @metricName) && (destinationType == "service") && (destinationName == @serviceName)' +
//        'return p.edges';
//
//    var stmt = db._createStatement({query: query});
//    stmt.bind('metricName', metricName);
//    stmt.bind('serviceName', serviceName);
//    var result = stmt.execute();
//
//    return result.toArray()[0];
//});

/**
 * Returns characteristics connected to the metric
 */
//aqlfunctions.register('dss::graph::characteristicNodesFromMetric', function(metricName){
//    var db = require('internal').db;
//    var console = require('console');
//    console.info('Calling custom AQL function dss::graph::characteristicNodesFromMetric...');
//    var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1})' +
//                'let sourceType = (p.source.type)' +
//                'let destinationType = (p.destination.type)' +
//                'let destinationName = (p.destination.name)' +
//                'filter (sourceType == "characteristic") && (destinationType == "metric") && (destinationName == @metricName)' +
//                'return p';
//
//    var stmt = db._createStatement({query: query});
//    stmt.bind('metricName', metricName);
//    var result = stmt.execute();
//
//    return result.toArray().map(function(path){
//        return path.source;
//    });
//}, false);

/**
 * Returns services edges connected to the characteristic (1..*)
 */
//aqlfunctions.register('dss::graph::serviceEdgesFromCharacteristic', function(characteristicName){
//    var db = require('internal').db;
//    var console = require('console');
//    console.info('Calling custom AQL function dss::graph::serviceEdgesFromCharacteristic...');
//    var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1})' +
//        'let sourceType = (p.source.type)' +
//        'let sourceName = (p.source.name)' +
//        'let destinationType = (p.destination.type)' +
//        'filter (sourceType == "characteristic") && (destinationType == "service") && (sourceName == @characteristicName)' +
//        'return p.edges';
//
//    var stmt = db._createStatement({query: query});
//    stmt.bind('characteristicName', characteristicName);
//    var result = stmt.execute();
//
//    return result.toArray();
//}, false);

/**
 * Returns service edge connected to the characteristic (1..1)
 */

//aqlfunctions.register('dss::graph::serviceEdgeFromCharacteristic', function(characteristicName, serviceName){
//    var db = require('internal').db;
//    var console = require('console');
//    console.info('Calling custom AQL function dss::graph::serviceEdgeFromCharacteristic...');
//    var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1})' +
//        'let sourceType = (p.source.type)' +
//        'let sourceName = (p.source.name)' +
//        'let destinationType = (p.destination.type)' +
//        'let destinationName = (p.destination.name)' +
//        'filter (sourceType == "characteristic") && (destinationType == "service") && (sourceName == @characteristicName) && (destinationName == @serviceName)' +
//        'return p.edges';
//
//    var stmt = db._createStatement({query: query});
//    stmt.bind('characteristicName', characteristicName);
//    stmt.bind('serviceName', serviceName);
//    var result = stmt.execute();
//
//    return result.toArray()[0];
//}, false);

/**
 * Returns service nodes connected to the characteristic (1..*)
 */

//aqlfunctions.register('dss::graph::serviceNodesFromCharacteristic', function(characteristicName){
//    var db = require('internal').db;
//    var console = require('console');
//    console.info('Calling custom AQL function dss::graph::serviceNodesFromCharacteristic...');
//    var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1})' +
//        'let sourceType = (p.source.type)' +
//        'let sourceName = (p.source.name)' +
//        'let destinationType = (p.destination.type)' +
//        'filter (sourceType == "characteristic") && (destinationType == "service") && (sourceName == @characteristicName)' +
//        'return p.destination';
//
//    var stmt = db._createStatement({query: query});
//    stmt.bind('characteristicName', characteristicName);
//    var result = stmt.execute();
//
//    return result.toArray();
//}, false);


/**
 * Updates the whole graph from metrics values
 */
//aqlfunctions.register('dss::graph::updateGraph', function(){
//    var db = require('internal').db;
//    var console = require('console');
//    console.info('Calling custom AQL function dss::graph::updateGraph...');
//    throw new Error('Not implemented yet!');
//}, false);

/**
 * Main services lookup graph functions
 */

//aqlfunctions.register('dss::graph::lookupServicesByCloudAndServiceTypes', function(cloudType, serviceType){
//    var db = require('internal').db;
//    var console = require('console');
//    console.info('******************************************************************');
//    console.info('********** SERVICES SEARCH (cloud type & service type) ***********');
//    console.info('******************************************************************');
//    var query = 'for path in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 3, maxLength: 3}) ' +
//        'let sourceType = path.source.type ' +
//        'let destinationType = path.destination.type ' +
//        'let cloudType = path.vertices[1].cloudType ' +
//        'let serviceType = path.vertices[1].serviceType ' +
//        'filter (sourceType == "provider") && (destinationType == "treatment") && (cloudType == @cloudType) && (serviceType == @serviceType) ' +
//        'collect service = path.vertices[1],' +
//        'provider = path.source,' +
//        'providerName = path.source.name into providers ' +
//        'return {provider: provider, service: service, characteristics: dss::utils::pathsToCharacteristicValues(providers[*].path)}';
//    var stmt = db._createStatement({query: query});
//    stmt.bind('cloudType', cloudType);
//    stmt.bind('serviceType', serviceType);
//    var result = stmt.execute();
//
//    return result.toArray();
//});

/**
 * Used in the service graph query for grouping providers by services and characteristic values
 */
//aqlfunctions.register('dss::utils::pathsToCharacteristicValues', function(paths){
//    return paths.map(function(path){
//        return {name: path.vertices[2].name , value: path.edges[1].data.value}
//    })
//}, false);
