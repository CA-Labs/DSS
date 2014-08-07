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
                    createdCharacteristic = repository.save(new CharacteristicModel(characteristic)).attributes;
                } catch (e){
                    throw new Error('Characteristic ' + JSON.stringify(characteristic) + ' already exists');
                }

                if(metrics){
                    // Iterate over the metrics array, and create an edge from each one to the characteristic previously created with the value of the metric
                    _.each(metrics, function(metricName){
                        var metric = db._collection('metric').byExample({name: metricName}).toArray()[0];
                        if(!metric){
                            throw new Error('Metric ' + key + ' does not exist');
                        }
                        // This may trigger an exception due to edge already existing
                        try {
                            db._collection('edges').save(createdCharacteristic._id, metric._id, {type: 'metric_characteristic'});
                        } catch (e) {
                            throw new Error('Edge between ' + metric._id + ' and ' + createdCharacteristic._id + ' already exists');
                        }
                    });
                }

                return createdCharacteristic;
            },
            params: [characteristicWithMetrics, self],
            waitForSync: false
        });

        return result;

    }

});

exports.repository = new CharacteristicRepository(ArangoDB.db._collection('characteristic'),{model: CharacteristicModel});

