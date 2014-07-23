(function() {
  
    'use strict';

    var Foxx = require('org/arangodb/foxx'),
    controller = new Foxx.Controller(applicationContext),
    arango = require('org/arangodb'),
    db = arango.db,
    console = require("console");

    /** Retrieves all assets by asset type (bsoia/toia/)
    *
    */
    controller.get('/assets/:type', function(req, res) {
        var query = 'for node in dss_nodes filter node.type == @type return node';
        var stmt = db._createStatement({query: query});
        stmt.bind('type', req.params('type'));
        var result = stmt.execute();
        res.json(result);
    }).pathParam('type', {
        description: 'The type of the asset (bsoia/toia)',
        type: 'string'
    });

    /** Retrieves all risks
    *
    */
    controller.get('/risks', function(req, res){
        var query = 'for node in dss_nodes filter node.type == "risk" return node';
        var stmt = db._createStatement({query: query});
        var result = stmt.execute();
        res.json(result);
    });

    /** Retrieves all treatments
    *
    */
    controller.get('/treatments', function(req, res){
        var query = 'for node in dss_nodes filter node.type == "treatment" return node';
        var stmt = db._createStatement({query: query});
        var result = stmt.execute();
        res.json(result);
        //res.json(dynamicRepository.getAll('treatments'))
    });

    /** Retrieves potential risks connected to TOIA
     * or BSOIA assets.
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

}());
