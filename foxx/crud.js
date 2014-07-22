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


    /**
     * --------------------------------------------
     * REPOSITORIES
     * --------------------------------------------
     */
    var nodesRepository = Foxx.Repository.extend({
        update: function (key, data) {
            return nodesCollection.updateById(key, data);
        },
        create: function (data) {
            return nodesCollection.save(data);
        },
        delete: function (key) {
            return nodesCollection.remove(key);
        },
        get: function (type) {
            return nodesCollection.byExmaple({ type: type });
        }
    });

    /**
     * --------------------------------------------
     * ROUTES
     * --------------------------------------------
     */

    /**
     * Gets all the nodes with certain type
     */
    controller.get('/node/:type', function(req, res) {
        res.json(nodesRepository.get(req.params('type')));
    }).pathParam('type', {
        description: 'The type of the nodes queried (charactersitic|metric|provider|service)',
        type: 'string'
    }).summary('Lists the nodes based on the type');

    /**
     * Puts a new node type which can be of a type of a service or metric
     */
    controller.put('/node', function (req, res) {
        // for now no validation
        res.json(nodesRepository.create(req.params('data')));
    }).bodyParam('data', {
        description: 'data of the new document which should be created',
        type: 'string'
    });

    /**
     * Modifies the dss_node which can be a type of a service of a metric
     */
    controller.post('/node/:id', function (req, res) {
        // for now no validation
        res.json(nodesRepository.update(req.params('id')), req.params('data'));
    }).errorResponse(arango.ArangoError, 404, "The document could not be found")
        .pathParam('id', {
            description: 'Id of the dss_nodes to be modified',
            type: 'string'
        })
        .bodyParam('data', {
            description: 'new data of the document which should be updated',
            type: 'string'
        });

    /**
     * Deletes a node
     */
    controller.delete('/node/:id', function (req, res) {
        // for now no validation
        nodesRepository.delete(req.params('id'));
        res.json({ status: true });
    }).errorResponse(arango.ArangoError, 404, "The document could not be found")
        .pathParam('id', {
            description: 'Id of the dss_nodes to be deleted',
            type: 'string'
        });

})();