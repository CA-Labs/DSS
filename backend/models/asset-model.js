/**
 * Created by Jordi Aranda.
 * 24/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx = require('org/arangodb/foxx'),
    joi = require('joi'),
    AssetModel = Foxx.Model.extend({
        schema: {
            name: joi.string().required(),
            type: joi.string().required().allow('bsoia', 'toia'),
            description: joi.string().required()
        }
    });

exports.model = AssetModel;
