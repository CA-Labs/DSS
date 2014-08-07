/**
 * This script gets executed on app startup.
 * Its main function is collections/graph initialization.
 **/

var console         = require('console')
    arangodb        = require('org/arangodb');
    db              = arangodb.db;
    graphs          = require('org/arangodb/general-graph'),
    aqlfunctions    = require('org/arangodb/aql/functions');

/*****************************************************************************
 **************************** DATABASE MANAGEMENT ****************************
 *****************************************************************************/

//Check if bsoia collection exists
if(db._collection('bsoia') === null) {
    console.log('Creating nodes collection "bsoia" in "dss" database...');
	db._createDocumentCollection('bsoia');
    //Create unique index in name property
    db._collection('bsoia').ensureUniqueConstraint('name');
} else {
    console.log('Collection "bsoia" already exists, nothing to do here...');
}

//Check if toia collection exists
if(db._collection('toia') === null) {
    console.log('Creating nodes collection "toia" in "dss" database...');
    db._createDocumentCollection('toia');
    //Create unique index in name property
    db._collection('toia').ensureUniqueConstraint('name');
} else {
    console.log('Collection "toia" already exists, nothing to do here...');
}

//Check if risk collection exists
if(db._collection('risk') === null) {
    console.log('Creating nodes collection "risk" in "dss" database...');
    db._createDocumentCollection('risk');
    //Create unique index in name property
    db._collection('risk').ensureUniqueConstraint('name');
} else {
    console.log('Collection "risk" already exists, nothing to do here...');
}

//Check if treatment collection exists
if(db._collection('treatment') === null) {
    console.log('Creating nodes collection "treatment" in "dss" database...');
    db._createDocumentCollection('treatment');
    //Create unique index in name property
    db._collection('treatment').ensureUniqueConstraint('name');
} else {
    console.log('Collection "treatment" already exists, nothing to do here...');
}

//Check if characteristic collection exists
if(db._collection('characteristic') === null) {
    console.log('Creating nodes collection "characteristic" in "dss" database...');
    db._createDocumentCollection('characteristic');
    //Create unique index in name property
    db._collection('characteristic').ensureUniqueConstraint('name');
} else {
    console.log('Collection "characteristic" already exists, nothing to do here...');
}

//Check if metric collection exists
if(db._collection('metric') === null) {
    console.log('Creating nodes collection "metric" in "dss" database...');
    db._createDocumentCollection('metric');
    //Create unique index in name property
    db._collection('metric').ensureUniqueConstraint('name');
} else {
    console.log('Collection "metric" already exists, nothing to do here...');
}

//Check if provider collection exists
if(db._collection('provider') === null) {
    console.log('Creating nodes collection "provider" in "dss" database...');
    db._createDocumentCollection('provider');
    //Create unique index in name property
    db._collection('provider').ensureUniqueConstraint('name');
} else {
    console.log('Collection "provider" already exists, nothing to do here...');
}

//Check if service collection exists
if(db._collection('service') === null) {
    console.log('Creating nodes collection "service" in "dss" database...');
    db._createDocumentCollection('service');
    //Create unique index in name property
    db._collection('service').ensureUniqueConstraint('name');
} else {
    console.log('Collection "service" already exists, nothing to do here...');
}

//TODO: Review edges collection and graph (we probably need to distinguish different edge types)

//Check if dss_edges collection exists
if(db._collection('edges') === null){
    console.log('Creating edges collection "edges"...');
    db._createEdgeCollection('edges');
    //Create unique index in type property
    db._collection('edges').ensureUniqueConstraint('from_to_type');
} else {
    console.log('Collection "edges" already exists, nothing to do here...');
}

//Check if graph exists (if not, create it from dss_edges/dss_nodes collections)
var available_graphs = graphs._list();

if(available_graphs.indexOf('dss') == -1){
    console.log('Graph "dss" does not exist, creating it from "edges" definition and documents collections...');
    graphs._create("dss", [graphs._directedRelation('edges', ['bsoia', 'toia', 'risk', 'treatment', 'metric', 'characteristic', 'service'], ['toia', 'risk', 'treatment', 'service', 'provider', 'metric'])], []);
} else {
    console.log("Graph 'dss' exists already, nothing to do here...");
}

/*****************************************************************************
 **************************** AQL CUSTOM FUNCTIONS ***************************
 *****************************************************************************/

/**
 * Returns service edges connected to the metric (1..*)
 */
aqlfunctions.register('dss::graph::serviceEdgesFromMetric', function(metricName){
    var db = require('internal').db;
    var console = require('console');
    console.info('Calling custom AQL function dss::graph::serviceEdgesFromMetric...');
    var metric = db._collection('metric').firstExample('name',metricName);
    return db._collection('edges').outEdges(metric);
}, false);

/**
 * Returns service edge connected to the metric (1..1)
 */
aqlfunctions.register('dss::graph::serviceEdgeFromMetric', function(metricName, serviceName){
    var db = require('internal').db;
    var console = require('console');
    console.info('Calling custom AQL function dss::graph::serviceEdgeFromMetric...');
    var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1})' +
        'let sourceType = (p.source.type)' +
        'let sourceName = (p.source.name)' +
        'let destinationType = (p.destination.type)' +
        'let destinationName = (p.destination.name)' +
        'filter (sourceType == "metric") && (sourceName == @metricName) && (destinationType == "service") && (destinationName == @serviceName)' +
        'return p.edges';

    var stmt = db._createStatement({query: query});
    stmt.bind('metricName', metricName);
    stmt.bind('serviceName', serviceName);
    var result = stmt.execute();

    return result.toArray()[0];

});

/**
 * Returns characteristics connected to the metric
 */
aqlfunctions.register('dss::graph::characteristicNodesFromMetric', function(metricName){
    var db = require('internal').db;
    var console = require('console');
    console.info('Calling custom AQL function dss::graph::characteristicNodesFromMetric...');
    var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1})' +
                'let sourceType = (p.source.type)' +
                'let destinationType = (p.destination.type)' +
                'let destinationName = (p.destination.name)' +
                'filter (sourceType == "characteristic") && (destinationType == "metric") && (destinationName == @metricName)' +
                'return p';

    var stmt = db._createStatement({query: query});
    stmt.bind('metricName', metricName);
    var result = stmt.execute();

    return result.toArray().map(function(path){
        return path.source;
    });

}, false);

/**
 * Returns services edges connected to the characteristic (1..*)
 */
aqlfunctions.register('dss::graph::serviceEdgesFromCharacteristic', function(characteristicName){
    var db = require('internal').db;
    var console = require('console');
    console.info('Calling custom AQL function dss::graph::serviceEdgesFromCharacteristic...');
    var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1})' +
        'let sourceType = (p.source.type)' +
        'let sourceName = (p.source.name)' +
        'let destinationType = (p.destination.type)' +
        'filter (sourceType == "characteristic") && (destinationType == "service") && (sourceName == @characteristicName)' +
        'return p.edges';

    var stmt = db._createStatement({query: query});
    stmt.bind('characteristicName', characteristicName);
    var result = stmt.execute();

    return result.toArray();

}, false);

/**
 * Returns service edge connected to the characteristic (1..1)
 */

aqlfunctions.register('dss::graph::serviceEdgeFromCharacteristic', function(characteristicName, serviceName){
    var db = require('internal').db;
    var console = require('console');
    console.info('Calling custom AQL function dss::graph::serviceEdgeFromCharacteristic...');
    var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1})' +
        'let sourceType = (p.source.type)' +
        'let sourceName = (p.source.name)' +
        'let destinationType = (p.destination.type)' +
        'let destinationName = (p.destination.name)' +
        'filter (sourceType == "characteristic") && (destinationType == "service") && (sourceName == @characteristicName) && (destinationName == @serviceName)' +
        'return p.edges';

    var stmt = db._createStatement({query: query});
    stmt.bind('characteristicName', characteristicName);
    stmt.bind('serviceName', serviceName);
    var result = stmt.execute();

    return result.toArray()[0];

}, false);


/**
 * Updates the whole graph from metrics values
 */
aqlfunctions.register('dss::graph::updateGraph', function(){
    var db = require('internal').db;
    var console = require('console');
    console.info('Calling custom AQL function dss::graph::updateGraph...');
    throw new Error('Not implemented yet!');
}, false);