/**
 * Created by Jordi Aranda.
 * 23/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx            = require('org/arangodb/foxx'),
    ServiceModel    = require('backend/models/service-model').model,
    ArangoDB        = require("org/arangodb"),
    db              = ArangoDB.db;

var ServiceRepository = Foxx.Repository.extend({

    saveServiceWithProviderAndMetrics: function(serviceWithProviderAndMetrics){

        // Multiple db operations involved, wrap everything within a transaction
        db._executeTransaction({
            collections: {
                write: ['provider', 'service', 'metric', 'edges']
            },
            action: function(data){
                var db = require('internal').db;
                var service = {
                    name: data.name,
                    type: data.type,
                    cloudType: data.cloudType
                };
                var serviceModel = new ServiceModel(service);
                if(!serviceModel.isValid){
                    throw new Error('Service model is not valid (' + JSON.stringify(serviceModel) + ')');
                } else {
                    var provider = data.provider;
                    var metrics = data.metrics;
                    // Save the service (this may trigger an exception due to unique index)
                    var createdService = db._collection('service').save(serviceModel);
                    if(provider){
                        // Check if provider exists before creating the edge between service and provider
                        // (this may trigger an exception due to document not found)
                        var foundProvider = db._collection('provider').document(provider._id);

                        // Create edge between service and provider of type service_provider
                        // (this may trigger an exception due to edge already existing)
                        db._collection('edges').save(createdService._id, foundProvider._id, {type: 'service_provider', data: {value: -1}});

                        // Iterate over the metrics, and create an edge from each one to the service with the value of the metric
                        _.each(metrics, function(metric){
                            if(!metric.data.value){
                                throw new Error('Metric ' + JSON.stringify(metric) + ' has no value property');
                            }
                            // This may trigger an exception due to edge already existing
                            db._collection('edges').save(metric._id, createdService._id, {type: 'metric_service', data: {value: metric.value}});
                        });
                    } else {
                        throw new Error('Provider not found');
                    }
                }
            },
            params: serviceWithProviderAndMetrics
        });

    }

})

var ServiceRepository = new Foxx.Repository(ArangoDB.db._collection('service'),{model: ServiceModel});

exports.repository = ServiceRepository;

