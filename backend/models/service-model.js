/**
 * Service Model
 * @author: Jacek Dominiak
 * @copyright: Jacek Dominiak
 * @created: 22/07/14
 */

var Foxx = require('org/arangodb/foxx'),
    joi = require('joi'),
    ServiceModel = Foxx.Model.extend({
        schema: {
            name: joi.string().required(),
            type: joi.string().required().default('service'),
            cloudType: joi.string().required().allow('PaaS', 'IaaS', 'SaaS'),
            serviceType: joi.string().required().allow('Compute', 'Blob storage', 'File system', 'Frontend', 'Backend', 'Middleware', 'Relational database', 'NoSQL database'),
            provider: joi.object().optional(),
            metrics: joi.object().optional()
        }
    });

exports.model = ServiceModel;

