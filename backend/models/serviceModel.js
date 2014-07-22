/**
 * Service Model
 * @author: Jacek Dominiak
 * @copyright: Jacek Dominiak
 * @created: 22/07/14
 */

var FoxxModel = require('org/arangodb/foxx').Model,
    joi = require('joi'),
    ServiceModel = FoxxModel.extend({
        schema: {
            name: joi.string().required(),
            type: joi.string().required().default('service').allow('PaaS', 'IaaS', 'SaaS')
        }
    });

exports.model = ServiceModel;

