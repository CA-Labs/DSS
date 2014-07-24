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
	db._create('bsoia');
} else {
    console.log('Collection "bsoia" already exists, nothing to do here...');
}

//Check if toia collection exists
if(db._collection('toia') === null) {
    console.log('Creating nodes collection "toia" in "dss" database...');
    db._create('toia');
} else {
    console.log('Collection "toia" already exists, nothing to do here...');
}

//Check if risk collection exists
if(db._collection('risk') === null) {
    console.log('Creating nodes collection "risk" in "dss" database...');
    db._create('risk');
} else {
    console.log('Collection "risk" already exists, nothing to do here...');
}

//Check if treatment collection exists
if(db._collection('treatment') === null) {
    console.log('Creating nodes collection "treatment" in "dss" database...');
    db._create('treatment');
} else {
    console.log('Collection "treatment" already exists, nothing to do here...');
}

//Check if characteristic collection exists
if(db._collection('characteristic') === null) {
    console.log('Creating nodes collection "characteristic" in "dss" database...');
    db._create('characteristic');
} else {
    console.log('Collection "characteristic" already exists, nothing to do here...');
}

//Check if metric collection exists
if(db._collection('metric') === null) {
    console.log('Creating nodes collection "metric" in "dss" database...');
    db._create('metric');
} else {
    console.log('Collection "metric" already exists, nothing to do here...');
}

//Check if provider collection exists
if(db._collection('provider') === null) {
    console.log('Creating nodes collection "provider" in "dss" database...');
    db._create('provider');
} else {
    console.log('Collection "provider" already exists, nothing to do here...');
}

//Check if service collection exists
if(db._collection('service') === null) {
    console.log('Creating nodes collection "service" in "dss" database...');
    db._create('service');
} else {
    console.log('Collection "service" already exists, nothing to do here...');
}

//TODO: Review edges collection and graph (we probably need to distinguish different edge types)

//Check if dss_edges collection exists
if(db._collection('edges') === null){
    console.log('Creating edges collection "edges"...');
    db._create('edges');
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