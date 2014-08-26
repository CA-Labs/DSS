/**
 * Created by Jordi Aranda.
 * 24/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx                    = require('org/arangodb/foxx'),
    TOIAModel               = require('backend/models/toia-model').model,
    ArangoDB                = require("org/arangodb");


var TOIARepository = new Foxx.Repository(ArangoDB.db._collection('toia'),{model: TOIAModel});

exports.repository = TOIARepository;
