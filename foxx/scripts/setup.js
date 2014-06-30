/* This script gets executed on app startup */

var console = require("console");
var arangodb = require("org/arangodb");
var db = arangodb.db;

var dss_nodes = applicationContext.collectionName("dss_nodes");

if(db._collection(dss_nodes) === null) {
	var collection = db._create(dss_nodes);
} else {
	console.log("Collection '%s' already exists, nothing to set up...", dss_nodes);
}