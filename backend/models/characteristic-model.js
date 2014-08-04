/**
 * Characteristic Model
 * @author: Jacek Dominiak
 * @copyright: Jacek Dominiak
 * @created: 22/07/14
 */

var Foxx = require('org/arangodb/foxx'),
    joi = require('joi'),
    CharacteristicModel = Foxx.Model.extend({
        schema: {
            name: joi.string().required(),
            type: joi.string().required().default('characteristic'),
            source: joi.string().required().default('SMI'),
            level: joi.string().optional(),
            formula: joi.array().required(),
            metrics: joi.object().optional()
        }
    });

exports.model = CharacteristicModel;