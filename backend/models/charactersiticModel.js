/**
 * Characteristic Model
 *
 * @author: Jacek Dominiak
 * @copyright: Jacek Dominiak
 * @created: 22/07/14
 */

var FoxxModel = require('org/arangodb/foxx').Model,
    joi = require('joi'),
    CharacteristicModel = FoxxModel.extend({
        schema: {
            name: joi.string().required(),
            type: joi.string().required().default('characteristic'),
            source: joi.string().required().default('SMI'),
            level: joi.string().optional(),
            formula: joi.string().optional()
        }
    });

exports.model = CharacteristicModel;