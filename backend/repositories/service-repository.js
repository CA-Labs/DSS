/**
 * Created by Jordi Aranda.
 * 23/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx            = require('org/arangodb/foxx'),
    ServiceModel    = require('backend/models/service-model').model,
    ArangoDB        = require("org/arangodb");


var ServiceRepository = new Foxx.Repository(ArangoDB.db._collection('service'),{model: ServiceModel});

exports.repository = ServiceRepository;

