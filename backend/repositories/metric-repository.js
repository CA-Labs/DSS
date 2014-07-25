/**
 * Created by Jordi Aranda.
 * 24/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx            = require('org/arangodb/foxx'),
    MetricModel     = require('backend/models/metric-model').model,
    ArangoDB        = require("org/arangodb");


var MetricRepository = new Foxx.Repository(ArangoDB.db._collection('metric'),{model: MetricModel});

exports.repository = MetricRepository;


