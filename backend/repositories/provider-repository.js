/**
 * Created by Jordi Aranda.
 * 24/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx                = require('org/arangodb/foxx'),
    ProviderModel       = require('backend/models/provider-model').model,
    ArangoDB            = require("org/arangodb");


var ProviderRepository = new Foxx.Repository(ArangoDB.db._collection('provider'),{model: ProviderModel});

exports.repository = ProviderRepository;

