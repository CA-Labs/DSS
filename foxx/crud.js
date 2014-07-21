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
        console = require('console');

    /**
     * --------------------------------------------
     * MODELS
     * --------------------------------------------
     */

    var ProviderModel = Foxx.Model.extend({},
        {
            attributes: {
                _key: "string",
                type: { type: "string", required: true, defaultValue: "provider" },
                name: { type: "string", required: true },
                year_founding: "number",
                website: { type: "string", required: true },
                logo_url: "string",
                description: { type: "string", required: true },
                number_of_employees: "number",
                headquarters: "string",
                headquarters_country: "string",
                headquarters_continent: "string"
            }
        });

    var MetricModel = Foxx.Model.extend({},
        {
            attributes: {
                _key: "string",
                name: { type: "string", required: true },
                type: { type: "string", required: true, defaultValue: "metric" },
                options: { type: "object", required: true }
            }
        });
    /**
     * --------------------------------------------
     * REPOSITORIES
     * --------------------------------------------
     */

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
    });

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