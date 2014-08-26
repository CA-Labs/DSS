/**
 * Created by Jordi Aranda.
 * 24/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx                = require('org/arangodb/foxx'),
    TreatmentModel      = require('backend/models/treatment-model').model,
    ArangoDB            = require("org/arangodb");


var TreatmentRepository = new Foxx.Repository(ArangoDB.db._collection('treatment'),{model: TreatmentModel});

exports.repository = TreatmentRepository;
