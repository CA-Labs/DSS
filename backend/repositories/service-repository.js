/**
 * Created by Jordi Aranda.
 * 23/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx            = require('org/arangodb/foxx'),
    ServiceModel    = require('backend/models/service-model').model,
    ArangoDB        = require("org/arangodb"),
    db              = ArangoDB.db,
    console         = require('console');

var ServiceRepository = Foxx.Repository.extend({

    saveServiceWithProviderAndMetrics: function(serviceWithProviderAndMetrics){

        // Reference to repository object
        var self = this;

        // Multiple db operations involved, wrap everything within a transaction
         var result = db._executeTransaction({
            collections: {
                write: ['provider', 'service', 'metric', 'edges']
            },
            action: function(params){

                var db = require('internal').db;
                var console = require('console');
                var _ = require('underscore');

                var data = params[0];
                var repository = params[1];

                console.info('Starting transaction execution in saveServiceWithProviderAndMetrics...');

                var service = {
                    name: data.name,
                    type: data.type,
                    cloudType: data.cloudType,
                    serviceType: data.serviceType
                };

                var provider = data.provider;
                var metrics = data.metrics;

                var createdService = null;
                // Save the service (this may trigger an exception due to unique index)
                try {
                    // No need for validation, this was validated first in the CRUD controller
                    createdService = repository.save(new ServiceModel(service));
                } catch (e){
                    throw new Error('Service ' + JSON.stringify(service) + ' already exists');
                }


                if(provider){

                    // Check if provider exists before creating the edge between service and provider
                    // (this may trigger an exception due to document not found)
                    var foundProvider = null;
                    try {
                        console.info('Looking up provider ' + provider._id);
                        foundProvider = db._collection('provider').document(provider._id);
                        console.info(JSON.stringify(foundProvider));
                    } catch (e) {
                        throw new Error('Provider ' + JSON.stringify(provider) + ' does not exist');
                    }

                    // Create edge between service and provider of type service_provider
                    // (this may trigger an exception due to edge already existing)
                    // TODO: What value should be associated to this edge?
                    try {
                        console.info('Creating link between ' + createdService.attributes._id + ' and ' + foundProvider._id);
                        db._collection('edges').save(createdService.attributes._id, foundProvider._id, {from_to_type: createdService.attributes._id + '_' + foundProvider._id + '_service_provider', data: {value: -1}});
                    } catch (e) {
                        throw new Error('Edge between ' + createdService.attributes._id + ' and ' + foundProvider._id + ' already exists');
                    }

                    // Iterate over the metrics hash object, and create an edge from each one to the service previously created with the value of the metric
                    console.info('Metrics provided', JSON.stringify(metrics));
                    for(key in metrics){
                        if(metrics.hasOwnProperty(key)){
                            //console.info('Metric key', key);
                            var metric = db._collection('metric').byExample({name: key}).toArray()[0];
                            if(!metric){
                                throw new Error('Metric ' + key + ' does not exist');
                            }
                            // This may trigger an exception due to edge already existing
                            try {
                                console.info('Creating link between ' + metric._id + ' and ' + createdService.attributes._id);
                                db._collection('edges').save(metric._id, createdService.attributes._id, {type: 'metric_service', data: {value: metrics[key]}});
                            } catch (e) {
                                throw new Error('Edge between ' + metric._id + ' and ' + createdService.attributes._id + ' already exists');
                            }
                        }
                    }
                }

                return createdService;
            },
            params: [serviceWithProviderAndMetrics, self],
            waitForSync: false
        });

        return result;

    }

});

exports.repository = new ServiceRepository(ArangoDB.db._collection('service'),{model: ServiceModel});

