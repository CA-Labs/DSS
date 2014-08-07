(function(){

    'use strict';

    var Foxx            = require('org/arangodb/foxx'),
        controller      = new Foxx.Controller(applicationContext),
        arango          = require('org/arangodb'),
        db              = arango.db,
        console         = require("console");

    /** Retrieves potential risks connected to TOIA or BSOIA assets.
     *
     */
    controller.get('potentialRisks', function(req, res){

        //TODO: Return projections and not full paths?
        var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 2})' +
            'let sourceType = (p.source.type)' +
            'let destinationType = (p.destination.type)' +
            'let sourceName = (lower(p.source.name))' +
            'filter ((sourceType == "bsoia" || sourceType == "toia") && (destinationType == "risk") && (contains(lower(@bsoias), sourceName) || contains(lower(@toias), sourceName)))' +
            'return p';

        var stmt = db._createStatement({query: query});

        var bsoias = '';
        var toias = '';

        if(req.params('bsoias') !== null && typeof req.params('bsoias') !== 'undefined'){
            bsoias = req.params('bsoias');
        }
        stmt.bind('bsoias', bsoias);

        if(req.params('toias') !== null && typeof req.params('toias') !== 'undefined'){
            toias = req.params('toias');
        }
        stmt.bind('toias', toias);

        var result = stmt.execute();
        res.json(result);

    }).queryParam('bsoias', {
        description: 'A comma-separated list of selected BSOIA assets names',
        type: 'string',
        required: false
    }).queryParam('toias', {
        description: 'A comma-separated list of selected TOIA assets names',
        type: 'string',
        required: false
    });

    /**
     * Retrieves treatments connected to risks.
     */
    controller.get('potentialTreatments', function(req, res){

        //TODO: Return projections and not full paths?
        var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1})' +
            'let sourceType = (p.source.type)' +
            'let destinationType = (p.destination.type)' +
            'let sourceName = (lower(p.source.name))' +
            'filter (sourceType == "risk") && (destinationType == "treatment") && (contains(lower(@risks), sourceName))' +
            'return p';

        var stmt = db._createStatement({query: query});

        var risks = '';

        if(req.params('risks') !== null && typeof req.params('risks') !== 'undefined'){
            risks = req.params('risks');
        }

        stmt.bind('risks', risks);

        var result = stmt.execute();
        res.json(result);

    }).queryParam('risks', {
        description: 'A comma-separated list of selected risks names',
        type: 'string',
        required: false
    });

    /**
     * Updates a metric edge value and updates the graph properly
     */
    controller.put('updateMetric', function(req, res){

        var metricId = req.params('metricId');
        var serviceId = req.params('serviceId');

        var newValue = req.body().newValue;

        db._executeTransaction({
            collections: {
                write: ['edges', 'metric', 'service', 'characteristic']
            },
            action: function(params){

                var db = require('internal').db;
                var console = require('console');
                var _ = require('underscore');

                var metricId = params[0];
                var serviceId = params[1];

                var newValue = params[2];

                console.info('Starting update process on metric ' + metricId + ' for service ' + serviceId + ' with new value ' + newValue);

                // Update metric - service edge with new value
                var query = 'for edge in dss::graph::serviceEdgeFromMetric(@metricId, @serviceId)' +
                            'update edge with {"value": @newValue} in edges';

                var stmt = db._createStatement({query: query});
                stmt.bind('metricId', metricId);
                stmt.bind('serviceId', serviceId);
                stmt.bind('newValue', newValue);
                stmt.execute();

                // Recompute affected characteristic - service edges values

                // 1) Grab characteristic nodes connected to the metric
                console.info('Trying to retrieve characteristic nodes from metric ' + metricId + '.');
                var query = 'for node in dss::graph::characteristicNodesFromMetric(@metricId) return node';
                var stmt = db._createStatement({query: query});
                stmt.bind('metricId', metricId);
                var characteristics = stmt.execute()._documents;
                console.info('Successful retrieval.');

                // 2) Compute formula value for each characteristic and update characteristic - service edge
                _.each(characteristics, function(characteristic){
                    var characteristicId = characteristic._id;
                    var characteristicFormula = eval(characteristic.formula);
                    console.info('Characteristic formula', characteristicFormula);
                    var characteristicFunction = Function.apply(null, characteristicFormula);
                    var newValue = characteristicFunction(serviceId);
                    console.info(newValue);
                    var query = 'for edge in dss::graph::serviceEdgeFromCharacteristic(@characteristicId, @serviceId)' +
                                'update edge with {"value": @newValue} in edges';
                    var stmt = db._createStatement({query: query});
                    stmt.bind('characteristicId', characteristicId);
                    stmt.bind('serviceId', serviceId);
                    stmt.bind('newValue', newValue);
                    stmt.execute();
                })
            },
            params: [metricId, serviceId, newValue]
        });

    }).queryParam('metricId', {
        descripton: 'A valid metric node id',
        type: 'string',
        required: true
    }).queryParam('serviceId', {
        description: 'A valid service node id',
        type: 'string',
        required: true
    });

})();
