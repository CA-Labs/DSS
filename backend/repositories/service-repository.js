/**
 * Created by Jordi Aranda.
 * 23/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx            = require('org/arangodb/foxx'),
    ServiceModel    = require('backend/models/serviceModel').model,
    ArangoDB        = require("org/arangodb");


var ServiceRepository = new Foxx.Repository(ArangoDB.db._collection('dss_nodes'),{model: ServiceModel});

exports.repository = ServiceRepository;

