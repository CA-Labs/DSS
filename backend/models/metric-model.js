/**
 * Metric Model
 * @author: Jacek Dominiak
 * @copyright: Jacek Dominiak
 * @created: 22/07/14
 */

var Foxx = require('org/arangodb/foxx'),
    joi = require('joi'),
    MetricModel = Foxx.Model.extend({
        schema: {
            name: joi.string().required(),
            type: joi.string().required().default('metric'),
            options: joi.object().min(2).optional()
        }
    });

exports.model = MetricModel;
