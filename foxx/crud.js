/**
 * Crud main fox file
 * @author: Jacek Dominiak
 * @copyright: Jacek Dominiak
 * @created: 21/07/14
 */

// Self invoke
(function () {
    "use strict";

    var Foxx = require('org/arangodb/foxx'),
        controller = new Foxx.Controller(applicationContext),
        arango = require('org/arangodb'),
        db = arango.db,
        nodesCollection = db._collection('dss_nodes'),
        edgesCollection = db._collection('dss_edges'),
        console = require('console'),
        joi = require('joi'),
        _ = require('underscore');

    /**
     * --------------------------------------------
     * SCHEMAS
     * Schemas in this context are replacements for the models as we do store the data in the same
     * dss_nodes collection. Schemas will be used for the data input validation
     * --------------------------------------------
     */

    /**
     * Schema which holds providers data, used to make a edge connection to the service
     * the provider is offering
     */
    var ProviderSchema = joi.object().keys(
        {
            type: joi.string().valid('provider').required().default('provider'),
            name: joi.string().required(),
            year_founding: joi.number().optional(),
            website: joi.string().required(),
            logo_url: joi.string().optional(),
            description: joi.string().required(),
            number_of_employees: joi.number().optional(),
            headquarters: joi.string().optional(),
            headquarters_country: joi.string().optional(),
            headquarters_continent: joi.string().optional()
        }
    );

    /**
     * Metric schema used to add and retrieve new metrics used to feed the service data
     * new services can be added ONLY with the currently existings metrics and if one more is needed
     * new metric should be added at first.
     */
    var MetricSchema = joi.object().keys(
        {
            name: joi.string().required(),
            type: joi.string().required().default('metric').allow('metric'),
            options: joi.object().required()
        }
    );

    var nodesRepositrory = Foxx.Repository.extend({});

    /**
     * --------------------------------------------
     * ROUTES
     * --------------------------------------------
     */

    /**
     * Gets all the nodes with certain type
     */
    controller.get('/node/:type', function(req, res) {
        var query = 'for node in dss_nodes filter node.type == @type return node';
        var stmt = db._createStatement({query: query});
        stmt.bind('type', req.params('type'));
        var result = stmt.execute();
        res.json(result);
    }).pathParam('type', {
        description: 'The type of the nodes queried (charactersitic|metric|provider|service)',
        type: 'string'
    }).summary('Lists the nodes based on the type');

    /**
     * Puts a new node type which can be of a type of a service or metric
     */
    controller.put('/node', function (req, res) {

    });

    /**
     * Modifies the dss_node which can be a type of a service of a metric
     */
    controller.post('/node/:id', function (req, res) {

    });

    /**
     * Deletes a node
     */
    controller.delete('/node/:id', function (req, res) {

    });

})();