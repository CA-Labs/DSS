/**
 * Metric Model
 * @author: Jacek Dominiak
 * @copyright: Jacek Dominiak
 * @created: 22/07/14
 */

var FoxxModel = require('org/arangodb/foxx').Model,
    joi = require('joi'),
    MetricModel = FoxxModel.extend({
        schema: {
            name: joi.string().required(),
            type: joi.string().required().default('metric'),
            options: joi.object().min(2)
        }
    });

exports.model = MetricModel;
