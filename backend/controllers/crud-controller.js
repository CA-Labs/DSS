(function () {
    "use strict";

    var Foxx                = require('org/arangodb/foxx'),
        controller          = new Foxx.Controller(applicationContext),
        arango              = require('org/arangodb'),
        db                  = arango.db,
        console             = require('console'),
        joi                 = require('joi'),
        _                   = require('underscore');

    //
    // ----------------------
    // REPOSITORIES & MODELS
    // ----------------------
    //

    var CharacteristicRepository = require('backend/repositories/characteristic-repository').repository;
    var CharacteristicModel = require('backend/models/characteristic-model').model;

    var MetricRepository = require('backend/repositories/metric-repository').repository;
    var MetricModel = require('backend/models/metric-model').model;

    var ProviderRepository = require('backend/repositories/provider-repository').repository;
    var ProviderModel = require('backend/models/provider-model').model;

    var ServiceRepository = require('backend/repositories/service-repository').repository;
    var ServiceModel = require('backend/models/service-model').model;

    var BSOIARepository = require('backend/repositories/bsoia-repository').repository;
    var BSOIAModel = require('backend/models/bsoia-model').model;

    var TOIARepository = require('backend/repositories/toia-repository').repository;
    var TOIAModel = require('backend/models/toia-model').model;

    var RiskRepository = require('backend/repositories/risk-repository').repository;
    var RiskModel = require('backend/models/risk-model').model;

    var TreatmentRepository = require('backend/repositories/treatment-repository').repository;
    var TreatmentModel = require('backend/models/treatment-model').model;

    //
    // Given a bulk of objects (or an object), creates an array of models
    // for each of them, so that they can be stored in ArangoDB afterwards.
    // @param bulk An array of objects (or object) to be stored in the database.
    // @returns {Object} An object containing the repository to be used and the
    // models to be stored by using this repository.
    //
    var createModels = function (bulk) {

        var model = null;
        var dataModels = [];
        var repository = null;

        //Used to validate all models are of same kind
        var firstType = null;

        if(_.isArray(bulk)){

            var first = true;
            var firstType = bulk[0].type;

            _.each(bulk, function (data) {

                if (!_.isUndefined(data.type)) {

                    //Check all nodes are of same type
                    if(data.type != firstType){
                        throw Error('Nodes provided are of different type');
                    }

                    switch (data.type) {
                        case 'metric':
                            model = new MetricModel(data);
                            if(first) {
                                first = false;
                                repository = MetricRepository;
                            }
                            break;
                        case 'characteristic':
                            model = new CharacteristicModel(data);
                            if(first) {
                                first = false;
                                repository = CharacteristicRepository;
                            }
                            break;
                        case 'provider':
                            model = new ProviderModel(data);
                            if(first) {
                                first = false;
                                repository = ProviderRepository;
                            }
                            break;
                        case 'service':
                            model = new ServiceModel(data);
                            if(first){
                                first = false;
                                repository = ServiceRepository;
                            }
                            break;
                        case 'bsoia':
                            model = new BSOIAModel(data);
                            if(first){
                                first = false;
                                repository = BSOIARepository;
                            }
                            break;
                        case 'toia':
                            model = new TOIAModel(data);
                            if(first){
                                first = false;
                                repository = TOIARepository;
                            }
                            break;
                        case 'risk':
                            model = new RiskModel(data);
                            if(first){
                                first = false;
                                repository = RiskRepository;
                            }
                            break;
                        case 'treatment':
                            model = new TreatmentModel(data);
                            if(first){
                                first = false;
                                repository = TreatmentRepository;
                            }
                            break;
                        default:
                            model = null;
                            break;
                    }

                    if (model && model.isValid) {
                        dataModels.push(model);
                    } else {
                        throw Error('Model validation failed');
                    }

                } else {
                    throw Error('Node type is undefined');
                }

            });

        } else if(_.isObject(bulk)){

            if(!_.isUndefined(bulk.type)){

                switch(bulk.type){
                    case 'metric':
                        model = new MetricModel(bulk);
                        repository = MetricRepository;
                        break;
                    case 'characteristic':
                        model = new CharacteristicModel(bulk);
                        repository = CharacteristicRepository;
                        break;
                    case 'provider':
                        model = new ProviderModel(bulk);
                        repository = ProviderRepository;
                        break;
                    case 'service':
                        model = new ServiceModel(bulk);
                        repository = ServiceRepository;
                        break;
                    case 'bsoia':
                        model = new BSOIAModel(bulk);
                        repository = BSOIARepository;
                        break;
                    case 'toia':
                        model = new TOIAModel(bulk);
                        repository = TOIARepository;
                        break;
                    case 'risk':
                        model = new RiskModel(bulk);
                        repository = RiskRepository;
                        break;
                    case 'treatment':
                        model = new TreatmentModel(bulk);
                        repository = TreatmentRepository;
                        break;
                    default:
                        model = null;
                        break;
                }

                if(model && model.isValid) {
                    dataModels.push(model);
                } else {
                    throw Error('Model validation failed');
                }

            } else {
                throw Error('Nod type is undefined');
            }
        }

        return {repository: repository, models: dataModels};

    };


    //
    // --------------------------------------------
    // ROUTES
    // --------------------------------------------
    //

    /** Gets all the nodes with certain type.
     *
     */
    controller.get('/nodes/:type', function(req, res) {
        var type = req.params('type');
        switch(type){
            case 'characteristic':
                // Don't return the model, but its data
                var characteristics = CharacteristicRepository.all();
                characteristics = _.map(characteristics, function(characteristic){
                    return characteristic.forClient();
                });
                res.json(characteristics);
                break;
            case 'metric':
                // Don't return the model, but its data
                var metrics = MetricRepository.all();
                metrics = _.map(metrics, function(metric){
                    return metric.forClient();
                });
                res.json(metrics);
                break;
            case 'provider':
                // Don't return the model, but its data
                var providers = ProviderRepository.all();
                providers = _.map(providers, function(provider){
                    return provider.forClient();
                });
                res.json(providers);
                break;
            case 'service':
                // Don't return the model, but its data
                var services = ServiceRepository.all();
                services = _.map(services, function(service){
                    return service.forClient();
                });
                res.json(services);
                break;
            case 'bsoia':
                // Don't return the model, but its data
                var bsoias = BSOIARepository.all();
                bsoias = _.map(bsoias, function(bsoia){
                    return bsoia.forClient();
                });
                res.json(bsoias);
                break;
            case 'toia':
                // Don't return the model, but its data
                var toias = TOIARepository.all();
                toias = _.map(toias, function(toia){
                    return toia.forClient();
                });
                res.json(toias);
                break;
            case 'risk':
                // Don't return the model, but its data
                var risks = RiskRepository.all();
                risks = _.map(risks, function(risk){
                    return risk.forClient();
                });
                res.json(risks);
                break;
            case 'treatment':
                // Don't return the model, but its data
                var treatments = TreatmentRepository.all();
                treatments = _.map(treatments, function(treatment){
                   return treatment.forClient();
                });
                res.json(treatments);
                break;
            default:
                res.json({error: true, reason: 'Unknown node type'});
                break;
        }
    }).pathParam('type', {
        description: 'The type of the nodes (characteristic|metric|provider|service|bsoia|toia|risk|treatment)',
        type: 'string',
        required: true
    });

    /** Gets the node with specified type and id.
     *
     */
    controller.get('/nodes/:type/:id', function (req, res) {

        var type = req.params('type');
        var id = req.params('id');
        var repository = null;

        if(type && id){
            switch(type){
                case 'characteristic':
                    repository = CharacteristicRepository;
                    break;
                case 'metric':
                    repository = MetricRepository;
                    break;
                case 'provider':
                    repository = ProviderRepository;
                    break;
                case 'service':
                    repository = ServiceRepository;
                    break;
                case 'bsoia':
                    repository = BSOIARepository;
                    break;
                case 'toia':
                    repository = TOIARepository;
                    break;
                case 'risk':
                    repository = RiskRepository;
                    break;
                case 'treatment':
                    repository = TreatmentRepository;
                    break;
                default:
                    res.json({error: true, reason: 'Unknown node type'});
                    break;
            }
        }

        if(repository){
            res.json(repository.byId(type + '/' + id).forClient());
        } else {
            res.json({error: true, reason: 'Unknown type ' + type + ' or invalid id'});
        }

    }).pathParam('type', {
        description: 'The type of the nodes (characteristic|metric|provider|service|bsoia|toia|risk|treatment)',
        type: 'string',
        required: true
    }).pathParam('id', {
        description: 'Id of the node to be retrieved',
        type: 'string',
        required: true
    });

    /** Creates a new node or an array of nodes of a certain type.
     *
     */
    controller.post('/nodes/:type', function (req, res) {

        var bulk = req.body();
        var modelsAndRepository = createModels(bulk);
        var models = modelsAndRepository.models;
        var repository = modelsAndRepository.repository;

        if(repository && models.length > 0){

            // Each save call returns a JSON with the response, we want
            // to aggregate all them and return them as a single response
            // after the bulk insertion.
            var jsonResponse = [];

            // Iterate over models and save them
            _.each(models, function(model){
                jsonResponse.push(repository.save(model));
            });

            // Return save responses aggregation as response
            res.json(jsonResponse);

        }  else {
            res.json({error: true});
        }

    }).pathParam('type', {
        description: 'The type of the nodes (characteristic|metric|provider|service|bsoia|toia|risk|treatment)',
        type: 'string',
        required: true
    });

    /** Modifies a node of a certain type by id.
     *
     */
    controller.put('/nodes/:type/:id', function (req, res) {

        var type = req.params('type');
        var id = req.params('id');
        var raw = req.body();
        var validationError = false;

        if(type && id){
            var model = null;
            switch(type){
                case 'characteristic':
                    model = new CharacteristicModel(raw);
                    if(model.isValid){
                        res.json(CharacteristicRepository.replaceById(id, model).forClient());
                    } else {
                       validationError = true;
                    }
                    break;
                case 'metric':
                    model = new MetricModel(raw);
                    if(model.isValid){
                        res.json(MetricRepository.replaceById(id, model).forClient());
                    } else {
                        validationError = true;
                    }
                    break;
                case 'provider':
                    model = new ProviderModel(raw);
                    if(model.isValid){
                        res.json(ProviderRepository.replaceById(id, model).forClient());
                    } else {
                        validationError = true;
                    }
                    break;
                case 'service':
                    model = new ServiceModel(raw);
                    if(model.isValid){
                        res.json(ServiceRepository.replaceById(id, model).forClient());
                    } else {
                        validationError = true;
                    }
                    break;
                case 'bsoia':
                    model = new BSOIAModel(raw);
                    if(model.isValid){
                        res.json(BSOIARepository.replaceById(id, model).forClient());
                    } else {
                        validationError = true;
                    }
                    break;
                case 'toia':
                    model = new TOIAModel(raw);
                    if(model.isValid){
                        res.json(TOIARepository.replaceById(id, model).forClient());
                    } else {
                        validationError = true;
                    }
                    break;
                case 'risk':
                    model = new RiskcModel(raw);
                    if(model.isValid){
                        res.json(RiskRepository.replaceById(id, model).forClient());
                    } else {
                        validationError = true;
                    }
                    break;
                case 'treatment':
                    model = new TreatmentModel(raw);
                    if(model.isValid){
                        res.json(TreatmentRepository.replaceById(id, model).forClient());
                    } else {
                        validationError = true;
                    }
                    break;
                default:
                    res.json({error: true, reason: 'Unknown node type'});
                    break;
            }

            if(validationError){
                res.json({error: true, reason: 'Model validation error'});
            }

        } else {

            if(!type){
                res.json({error: true, reason: 'Type is null or undefined'});
            } else if(!id){
                res.json({error: true, reason: 'Id is null or undefined'});
            }

        }

    }).pathParam('type', {
        description: 'The type of the nodes (characteristic|metric|provider|service|bsoia|toia|risk|treatment)',
        type: 'string',
        required: true
    }).pathParam('id', {
        description: 'Id of the node to be updated',
        type: 'string',
        required: true
    });

    /** Deletes a node of a certain type by id.
     *
     */
    controller.delete('/nodes/:type/:id', function (req, res) {

        var type = req.params('type');
        var id = req.params('id');

        if(type && id){

            switch(type){
                case 'characteristic':
                    res.json(CharacteristicRepository.removeById(id));
                    break;
                case 'metric':
                    res.json(MetricRepository.removeById(id));
                    break;
                case 'provider':
                    res.json(ProviderRepository.removeById(id));
                    break;
                case 'service':
                    res.json(ServiceRepository.removeById(id));
                    break;
                case 'bsoia':
                    res.json(BSOIARepository.removeById(id));
                    break;
                case 'toia':
                    res.json(TOIARepository.removeById(id));
                    break;
                case 'risk':
                    res.json(RiskRepository.removeById(id));
                    break;
                case 'treatment':
                    res.json(TreatmentRepository.removeById(id));
                    break;
                default:
                    res.json({error: true, reason: 'Unknown node type'});
                    break;
            }

        } else {

            if(!type){
                res.json({error: true, reason: 'Type is null or undefined'});
            } else if(!id){
                res.json({error: true, reason: 'Id is null or undefined'});
            }

        }

    }).pathParam('type', {
        description: 'The type of the nodes (characteristic|metric|provider|service|bsoia|toia|risk|treatment)',
        type: 'string',
        required: true
    }).pathParam('id', {
        description: 'Id of the node to be removed',
        type: 'string',
        required: true
    });

})();