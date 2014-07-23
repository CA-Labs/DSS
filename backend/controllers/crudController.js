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
        Repository = require('backend/repositories/dynamicRepository').repository,

        console = require('console'),
        joi = require('joi'),
        _ = require('underscore');

    //
    // --------------------------------------------
    // REPOSITORIES INITIALIZATION
    // --------------------------------------------
    //

    var nodesRepository = new Repository(nodesCollection, { });

    //
    // --------------------------------------------
    // ROUTES
    // --------------------------------------------
    //

    /** Gets all the nodes with certain type
     *
     */
    controller.get('/node/:type', function(req, res) {
        res.json(nodesRepository.byExample({ type: req.params('type')}));
    }).pathParam('type', {
        description: 'The type of the nodes (charactersitic|metric|provider|service)',
        type: 'string'
    });

    /** Puts a new node type service or metric
     *
     */
    controller.put('/node', function (req, res) {
        // for now no validation
        res.json(nodesRepository.create(req.params('data')));
    });

    /** Modifies the dss_node type of a service of a metric
     *
     */
    controller.post('/node/:id', function (req, res) {
        // for now no validation
        res.json(nodesRepository.update(req.params('id')), req.params('data'));
    }).errorResponse(arango.ArangoError, 404, "The document could not be found")
        .pathParam('id', {
            description: 'Id of the dss_nodes to be modified',
            type: 'string'
        });

    /** Deletes a node
     *
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