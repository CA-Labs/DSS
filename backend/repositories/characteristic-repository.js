/**
 * Created by Jordi Aranda.
 * 23/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx                    = require('org/arangodb/foxx'),
    CharacteristicModel     = require('backend/models/characteristic-model').model,
    ArangoDB                = require("org/arangodb");


var CharacteristicRepository = new Foxx.Repository(ArangoDB.db._collection('characteristic'),{model: CharacteristicModel});

exports.repository = CharacteristicRepository;

