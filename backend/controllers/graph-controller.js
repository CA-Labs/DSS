(function(){

    'use strict';

    var Foxx            = require('org/arangodb/foxx'),
        controller      = new Foxx.Controller(applicationContext),
        arango          = require('org/arangodb'),
        db              = arango.db,
        console         = require("console");

    // Service lookup query types
    var QUERY_TYPE = {
        CLOUD_AND_SERVICE_TYPES: "1",
        TREATMENTS: "2"
    };

    /** Retrieves potential risks connected to TOIA or BSOIA assets.
     *
     */
    controller.get('potentialRisks', function(req, res){

        /*
        var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 2})' +
            'let sourceType = (p.source.type)' +
            'let destinationType = (p.destination.type)' +
            'let sourceName = (lower(p.source.name))' +
            'filter ((sourceType == "bsoia" || sourceType == "toia") && (destinationType == "risk") && (contains(lower(@bsoias), sourceName) || contains(lower(@toias), sourceName)))' +
            'return p';
        */

        // Ignore BSOIA's when finding potential risks (at least by now)
        var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1})' +
            'let sourceType = (p.source.type)' +
            'let destinationType = (p.destination.type)' +
            'let sourceName = (lower(p.source.name))' +
            'filter ((sourceType == "toia") && (destinationType == "risk") && (contains(lower(@toias), sourceName)))' +
            'return p';

        var stmt = db._createStatement({query: query});

        // var bsoias = '';
        var toias = '';

        /*
        if(req.params('bsoias') !== null && typeof req.params('bsoias') !== 'undefined'){
            bsoias = req.params('bsoias');
        }
        stmt.bind('bsoias', bsoias);
        */

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

        var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1}) ' +
                    'let sourceType = (p.source.type) ' +
                    'let destinationType = (p.destination.type) ' +
                    'let sourceName = (lower(p.source.name)) ' +
                    'filter (sourceType == "risk") && (destinationType == "treatment") && (contains(lower(@risks), sourceName)) ' +
                    'collect risk = p.source.name into risks ' +
                    'return {risk: risk, treatments: risks[*].p.destination} ';

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
     * Retrieves risks-treatments mapping
     */
    controller.get('risksTreatmentsMapping', function(req, res){
        var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1}) ' +
            'let sourceType = (p.source.type) ' +
            'let destinationType = (p.destination.type) ' +
            'let sourceName = (lower(p.source.name)) ' +
            'filter (sourceType == "risk") && (destinationType == "treatment") ' +
            'collect risk = (p.source.name) into treatments ' +
            'return {risk: risk, treatments: treatments[*].p.destination.name}';

        var stmt = db._createStatement({query: query});

        var result = stmt.execute();
        res.json(result);
    });

    /**
     * Retrieves toia-risks mapping
     */
    controller.get('toiaRisksMapping', function(req, res){
        var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1}) ' +
            'let sourceType = (p.source.type) ' +
            'let destinationType = (p.destination.type) ' +
            'let sourceName = (lower(p.source.name)) ' +
            'filter (sourceType == "toia") && (destinationType == "risk") ' +
            'collect toia = (p.source.name) into risks ' +
            'return {toia: toia, risks: risks[*].p.destination.name}';

        var stmt = db._createStatement({query: query});

        var result = stmt.execute();
        res.json(result);
    });

    /**
     * Retrieves treatments connections to services.
     */
    controller.get('treatmentsConnectionsPerCloudAndServiceTypes', function(req, res){

        var query = 'for p in graph_paths("dss", {direction: "outbound", followCycles: false, minLength: 2, maxLength: 2}) ' +
                    'let sourceType = (p.source.type) ' +
                    'let destinationType = (p.destination.type) ' +
                    'filter (sourceType == "service") && (destinationType == "treatment") && (p.source.cloudType == @cloudType) && (p.source.serviceType == @serviceType) ' +
                    'collect cloud = (p.source.cloudType), ' +
                    'service = (p.source.serviceType), ' +
                    'treatments = (p.destination.name) into paths ' +
                    'return {cloud: cloud, service: service, treatments: treatments, numServices: length(paths)}';

        var stmt = db._createStatement({query: query});

        var cloudType = '';
        var serviceType = '';

        if(req.params('cloudType') !== null && typeof req.params('cloudType') !== 'undefined'){
            cloudType = req.params('cloudType');
        }

        if(req.params('serviceType') !== null && typeof req.params('serviceType') !== 'undefined'){
            serviceType = req.params('serviceType');
        }

        stmt.bind('cloudType', cloudType);
        stmt.bind('serviceType', serviceType);

        var result = stmt.execute();
        res.json(result);

    }).queryParam('cloudType', {
        description: 'A valid service cloud type (IaaS|PaaS|SaaS)',
        type: 'string',
        required: true
    }).queryParam('serviceType', {
        description: 'A valid service type (Compute|File system|Blob storage|Middleware|Relational database|NoSQL database|Frontend|Backend)',
        type: 'string',
        required: true
    });

    /**
     * Updates a metric edge value and updates the graph properly
     */
    controller.put('updateMetric', function(req, res){

        var metricName = req.params('metricName');
        var serviceName = req.params('serviceName');

        var newValue = req.body().newValue;

        var result = db._executeTransaction({
            collections: {
                write: ['edges', 'metric', 'service', 'characteristic']
            },
            action: function(params){

                var db = require('internal').db;
                var console = require('console');
                var _ = require('underscore');

                var metricName = params[0];
                var serviceName = params[1];

                var newValue = params[2];

                console.info('Starting update process on metric ' + metricName + ' for service ' + serviceName + ' with new value ' + newValue);

                // Update metric - service edge with new value
                var query = 'for edge in dss::graph::serviceEdgeFromMetric(@metricName, @serviceName)' +
                            'update edge with {"value": @newValue} in edges';

                var stmt = db._createStatement({query: query});
                stmt.bind('metricName', metricName);
                stmt.bind('serviceName', serviceName);
                stmt.bind('newValue', newValue);
                stmt.execute();

                // Recompute affected characteristic - service edges values

                // 1) Grab characteristic nodes connected to the metric
                var query = 'for node in dss::graph::characteristicNodesFromMetric(@metricName) return node';
                var stmt = db._createStatement({query: query});
                stmt.bind('metricName', metricName);
                var characteristics = stmt.execute()._documents;

                // 2) Compute formula value for each characteristic and update characteristic - service edge
                _.each(characteristics, function(characteristic){
                    var characteristicName = characteristic.name;
                    var characteristicFormula = eval(characteristic.formula);
                    console.info('Characteristic formula', characteristicFormula);
                    var characteristicFunction = Function.apply(null, characteristicFormula);
                    var newValue = characteristicFunction(serviceName);
                    console.info('Computed value', newValue);
                    var query = 'for edge in dss::graph::serviceEdgeFromCharacteristic(@characteristicName, @serviceName)' +
                                'update edge with {"value": @newValue} in edges';
                    var stmt = db._createStatement({query: query});
                    stmt.bind('characteristicName', characteristicName);
                    stmt.bind('serviceName', serviceName);
                    stmt.bind('newValue', newValue);
                    stmt.execute();
                });

                return {error: false};

            },
            params: [metricName, serviceName, newValue],
            waitForSync: false
        });

        res.json(result);

    }).queryParam('metricName', {
        descripton: 'A valid metric node name',
        type: 'string',
        required: true
    }).queryParam('serviceName', {
        description: 'A valid service node name',
        type: 'string',
        required: true
    });

    /**
     * Services lookup endpoint
     */
    controller.get('lookupServices', function(req, res) {

        var queryType = req.params('queryType');
        var result = [];

        switch (queryType) {
            case QUERY_TYPE.CLOUD_AND_SERVICE_TYPES:
                var cloudType = req.params('cloudType');
                var serviceType = req.params('serviceType');
                var query = 'for result in dss::graph::lookupServicesByCloudAndServiceTypes(@cloudType, @serviceType) return result';
                var stmt = db._createStatement({query: query});
                stmt.bind('cloudType', cloudType);
                stmt.bind('serviceType', serviceType);
                result = stmt.execute();
                break;
            case QUERY_TYPE.TREATMENTS:
                break;
            default:
                break;
        };

        res.json(result);

    }).queryParam('queryType', {
        description: 'Type of query (by cloud and service types [1], using a treatments list [2])',
        type: 'string',
        required: true
    }).queryParam('cloudType', {
        description: 'Type of cloud (PaaS|IaaS|SaaS)',
        type: 'string',
        required: false
    }).queryParam('serviceType', {
        description: 'Type of service (Compute|File system|Blob storage|Middleware|Relational database|NoSQL database|Frontend|Backend)',
        type: 'string',
        required: false
    }).queryParam('treatments', {
        description: 'A comma-separated list of treatments names values',
        type: 'string',
        required: false
    });


})();