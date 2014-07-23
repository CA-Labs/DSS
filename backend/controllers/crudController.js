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
    controller.get('/nodes/:type', function(req, res) {
        res.json(nodesRepository.byExample({ type: req.params('type')}));
    }).pathParam('type', {
        description: 'The type of the nodes (charactersitic|metric|provider|service)',
        type: 'string'
    });

    /** Gets the node with specified key
     *
     */
    controller.get('/node/:id', function (req, res) {
        res.json(nodesRepository.byId(req.params('id')));
    }).pathParam('id', {
        description: 'ID of the node to be retrieved',
        type: 'string'
    });

    /** Puts a new node type service or metric
     *
     */
    controller.put('/node', function (req, res) {
        // for now no validation
        res.json(nodesRepository.save(req.body()));
    });

    /** Modifies the dss_node type of a service of a metric
     *
     */
    controller.post('/node/:id', function (req, res) {
        // for now no validation
        res.json(nodesRepository.replaceById(req.params('id')), req.body());
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
        nodesRepository.remove(req.params('id'));
        res.json({ status: true });
    }).errorResponse(arango.ArangoError, 404, "The document could not be found")
        .pathParam('id', {
            description: 'Id of the dss_nodes to be deleted',
            type: 'string'
        });
})();