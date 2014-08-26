/**
 * Created by Jordi Aranda.
 * 24/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx = require('org/arangodb/foxx'),
    joi = require('joi'),
    TreatmentModel = Foxx.Model.extend({
        schema: {
            name: joi.string().required(),
            type: joi.string().required().allow('risk'),
            representation: joi.string().required().allow('slider', 'radio'),
            options: joi.string().required()
        }
    });

exports.model = TreatmentModel;

