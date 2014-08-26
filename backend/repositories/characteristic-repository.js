/**
 * Created by Jordi Aranda.
 * 23/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx                    = require('org/arangodb/foxx'),
    CharacteristicModel     = require('backend/models/characteristic-model').model,
    ArangoDB                = require("org/arangodb"),
    db                      = ArangoDB.db,
    console                 = require('console');


var CharacteristicRepository = Foxx.Repository.extend({

    saveCharacteristicWithMetrics: function(characteristicWithMetrics){

        //Reference to repository object
        var self = this;

        // Multiple db operations involved, wrap everything within a transaction
        var result = db._executeTransaction({
            collections: {
                write: ['characteristic', 'metric', 'edges']
            },
            action: function(params){

                var db = require('internal').db;
                var console = require('console');
                var _ = require('underscore');

                var data = params[0];
                var repository = params[1];

                console.info('Starting transaction execution in saveCharacteristicWithMetrics...');

                var characteristic = {
                    name: data.name,
                    type: data.type,
                    source: data.source,
                    level: data.level ? data.level : '',
                    formula: data.formula ? data.formula : ''
                };

                var metrics = data.metrics;

                var createdCharacteristic = null;
                // Save the characteristic (this may trigger an exception due to unique index)
                try {
                    // No need for validation, this was validated first in the CRUD controller
                    createdCharacteristic = repository.save(new CharacteristicModel(characteristic));
                } catch (e){
                    throw new Error('Characteristic ' + JSON.stringify(characteristic) + ' already exists');
                }

                if(metrics){
                    // Iterate over the metrics array, and create an edge from each one to the characteristic previously created with the value of the metric
                    _.each(metrics, function(metricName){
                        var metric = db._collection('metric').byExample({name: metricName}).toArray()[0];
                        if(!metric){
                            throw new Error('Metric ' + metricName + ' does not exist');
                        }
                        // This may trigger an exception due to edge already existing
                        try {
                            console.info('Creating link between ' + createdCharacteristic.attributes._id + ' and ' + metric._id);
                            db._collection('edges').save(createdCharacteristic.attributes._id, metric._id, {type: 'metric_characteristic'});
                        } catch (e) {
                            throw new Error('Edge between ' + createdCharacteristic.attributes._id + ' and ' + metric._id + ' already exists');
                        }
                    });
                }

                return createdCharacteristic;
            },
            params: [characteristicWithMetrics, self],
            waitForSync: false
        });

        return result;

    },
    updateCharacteristicFormula: function(id, newCharacteristicModel){

        // Reference to repository object
        var self = this;

        // Multiple db operations involved, wrap everything within a transaction
        var result = db._executeTransaction({
            collections: {
                write: ['characteristic', 'edges', 'metric', 'service']
            },
            action: function(params){

                var db = require('internal').db;
                var console = require('console');
                var _ = require('underscore');

                var characteristicId = params[0];
                var characteristicModel = params[1];
                var repository = params[2];

                console.info('Starting transaction execution in updateCharacteristicFormula...');

                // First, update the characteristic values
                var result = null;
                try {
                    result = repository.replaceById(id, characteristicModel);
                } catch (e) {
                    throw new Error('An error occurred while trying to update characteristic ' + id);
                }

                // Formula update process
                // 1. Retrieve all services connected to the characteristic and execute characteristic formula to grab the new value
                // WARNING: This assumes a correct characteristic formula!

                var characteristicName = result.attributes.name;
                var characteristicFormula = result.attributes.formula;

                var characteristicFunction = null;
                try {
                    characteristicFunction = Function.apply(null, eval(characteristicFormula));
                } catch (e) {
                    throw new Error('An error occurred while trying to parse formula function for characteristic ' + id);
                }

                console.info('Characteristic formula', characteristicFormula);
                var query = 'for node in dss::graph::serviceNodesFromCharacteristic(@characteristicName) return node';
                var stmt = db._createStatement({query: query});
                stmt.bind('characteristicName', characteristicName);
                var services = stmt.execute()._documents;

                _.each(services, function(service){
                    var serviceId = service._id;
                    // Update characteristic - service edge value
                    var newValue = null;
                    try {
                        newValue = characteristicFunction(service.name);
                    } catch (e) {
                        console.info('Exception', JSON.stringify(e));
                        throw new Error('It is not possible to compute value with provided formula in characteristic ' + id);
                    }

                    var newEdge = {data: {value: newValue}};
                    console.info('New value for characteristic-service edge', characteristicId, serviceId, newValue);
                    console.info('New edge', JSON.stringify(newEdge));

                    var query = 'for edge in edges filter edge._from==@characteristicId && edge._to==@serviceId update edge with @newEdge in edges'
                    var stmt = db._createStatement({query: query});
                    stmt.bind('characteristicId', characteristicId);
                    stmt.bind('serviceId', serviceId);
                    stmt.bind('newEdge', newEdge);
                    stmt.execute();
                });

                return result;

            },
            params: [id, newCharacteristicModel, self],
            waitForSync: false
        });

        return result;

    }

});

exports.repository = new CharacteristicRepository(ArangoDB.db._collection('characteristic'),{model: CharacteristicModel});

