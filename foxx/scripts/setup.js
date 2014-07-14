/**
 * This script gets executed on app startup.
 * Its main function is collections/graph initialization.
 **/

var console = require("console");
var arangodb = require("org/arangodb");
var db = arangodb.db;
var graphs = require("org/arangodb/general-graph");

//Check if dss_nodes collection exists
if(db._collection("dss_nodes") === null) {
    console.log("Creating nodes collection 'dss_nodes'...");
	var collection = db._create("dss_nodes");
} else {
    console.log("Collection 'dss_nodes' already exists, nothing to do here...");
}

//Check if dss_edges collection exists
if(db._collection("dss_edges") === null){
    console.log("Creating edges collection 'dss_edges'...");
    var collection = db._create("dss_edges");
} else {
    console.log("Collection 'dss_edges' already exists, nothing to do here...");
}

//Check if graph exists (if not, create it from dss_edges/dss_nodes collections)
var available_graphs = graphs._list();

if(available_graphs.indexOf("dss") == -1){
    console.log("Graph 'dss' does not exist, creating it from 'dss_edges' definition and 'dss_nodes' collection...");
    graphs._create("dss", [graphs._directedRelation("dss_edges", "dss_nodes", "dss_nodes")], ["dss_nodes"]);
} else {
    console.log("Graph 'dss' exists already, nothing to do here...");
}
