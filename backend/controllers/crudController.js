(function () {
    "use strict";

    var Foxx = require('org/arangodb/foxx'),
        controller = new Foxx.Controller(applicationContext),
        arango = require('org/arangodb'),
        db = arango.db,
        nodesCollection = db._collection('dss_nodes'),
        edgesCollection = db._collection('dss_edges'),
        Repository = require('backend/repositories/dynamicRepository').repository,
        MetricModel = require('backend/models/metricModel').model,
        CharacteristicModel = require('backend/models/characteristicModel').model,
        ProviderModel = require('backend/models/providerModel').model,
        ServiceModel = require('backend/models/serviceModel').model,
        console = require('console'),
        joi = require('joi'),
        _ = require('underscore');

    //
    // --------------------------------------------
    // REPOSITORIES INITIALIZATION
    // --------------------------------------------
    //

    var nodesRepository = new Repository(nodesCollection, { });

    var createModel = function (dataArray) {
        var dataModel = [];
        _.each(dataArray, function (data) {
            console.log(_.isUndefined(data.type));
            if (!_.isUndefined(data.type)) {
                var model;
                switch (data.type) {
                    case 'metric':
                        model = new MetricModel(data);
                        break;
                    case 'characteristic':
                        model = new CharacteristicModel(data);
                        break;
                    case 'provider':
                        model = new ProviderModel(data);
                        break;
                    case 'service':
                        model = new ServiceModel(data);
                        break;
                    default:
                        return false;
                }
                console.log(JSON.stringify(model));
                if (model.isValid) dataModel.push(model);
            }
        });
        return dataModel;
    };


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
        var responseData = [];
        var data = createModel(req.body());
        if (data) {
            _.each(data, function (objectToSave) {
                console.log('ffffff: ' + JSON.stringify(objectToSave.attributes));
                responseData.push(nodesRepository.save("{" + objectToSave.attributes +  "}"));
            });
            res.json(responseData);
        } else {
            res.json({success: false});
        }
    });

    /** Modifies the dss_node type of a service of a metric
     *
     */
    controller.post('/node/:id', function (req, res) {
        // for now no validation
        var data = createModel(req.body());
        if (data) {
            res.json(nodesRepository.replaceById(req.params('id')), data.attributes);
        } else {
            res.json({ success: false });
        }
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
        nodesRepository.removeById(req.params('id'));
        res.json({ status: true });
    }).errorResponse(arango.ArangoError, 404, "The document could not be found")
        .pathParam('id', {
            description: 'Id of the dss_nodes to be deleted',
            type: 'string'
        });
})();