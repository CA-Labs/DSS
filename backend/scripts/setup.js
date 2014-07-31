/**
 * This script gets executed on app startup.
 * Its main function is collections/graph initialization.
 **/

var console = require("console");
var arangodb = require("org/arangodb");
var db = arangodb.db;
var graphs = require("org/arangodb/general-graph");

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
    db._collection('edges').ensureUniqueConstraint('_from', '_to', 'type');
} else {
    console.log('Collection "edges" already exists, nothing to do here...');
}

//Check if graph exists (if not, create it from dss_edges/dss_nodes collections)
var available_graphs = graphs._list();

if(available_graphs.indexOf('dss') == -1){
    console.log('Graph "dss" does not exist, creating it from "edges" definition and documents collections...');
    graphs._create("dss", [graphs._directedRelation('edges', ['bsoia', 'toia', 'risk'], ['toia', 'risk', 'treatments'])], ['characteristic', 'metric', 'provider', 'service']);
} else {
    console.log("Graph 'dss' exists already, nothing to do here...");
}