/**
 * Created by Jordi Aranda.
 * 24/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx            = require('org/arangodb/foxx'),
    RiskModel       = require('backend/models/risk-model').model,
    ArangoDB        = require("org/arangodb");


var RiskRepository = new Foxx.Repository(ArangoDB.db._collection('risk'),{model: RiskModel});

exports.repository = RiskRepository;
