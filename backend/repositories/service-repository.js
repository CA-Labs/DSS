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

                var provider = data.provider;
                var metrics = data.metrics;
                var createdService = null;

                // Save the service (this may trigger an exception due to unique index)
                try {
                    createdService = db._collection('service').save(serviceModel);
                } catch (e){
                    throw new Error('Service ' + JSON.stringify(service) + ' already exists');
                }

                if(provider){

                    // Check if provider exists before creating the edge between service and provider
                    // (this may trigger an exception due to document not found)
                    var foundProvider = null;
                    try {
                        foundProvider = db._collection('provider').document(provider._id);
                    } catch (e) {
                        throw new Error('Provider ' + JSON.stringify(provider) + ' does not exist');
                    }

                    // Create edge between service and provider of type service_provider
                    // (this may trigger an exception due to edge already existing)
                    // TODO: What value should be associated to this edge?
                    try {
                        db._collection('edges').save(createdService._id, foundProvider._id, {from_to_type: createdService._id + '_' + foundProvider._id + '_' + service_provider, data: {value: -1}});
                    } catch (e) {
                        throw new Error('Edge between ' + createdService._id + ' and ' + foundProvider._id + ' already exists');
                    }

                    // Iterate over the metrics, and create an edge from each one to the service with the value of the metric
                    _.each(metrics, function(metric){
                        if(!metric.data.value){
                            throw new Error('Metric ' + JSON.stringify(metric) + ' has no value property');
                        }
                        // This may trigger an exception due to edge already existing
                        try {
                            db._collection('edges').save(metric._id, createdService._id, {type: 'metric_service', data: {value: metric.value}});
                        } catch (e) {
                            throw new Error('Edge between ' + metric._id + ' and ' + createdService._id + ' already exists');
                        }
                    });
                } else {
                    throw new Error('Provider not found');
                }

            },
            params: serviceWithProviderAndMetrics
        });

    }

});

var ServiceRepository = new Foxx.Repository(ArangoDB.db._collection('service'),{model: ServiceModel});

exports.repository = ServiceRepository;

