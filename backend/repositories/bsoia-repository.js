/**
 * Created by Jordi Aranda.
 * 24/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx                    = require('org/arangodb/foxx'),
    BSOIAModel              = require('backend/models/bsoia-model').model,
    ArangoDB                = require("org/arangodb");


var BSOIARepository = new Foxx.Repository(ArangoDB.db._collection('bsoia'),{model: BSOIAModel});

exports.repository = BSOIARepository;
