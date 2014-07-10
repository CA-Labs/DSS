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
    });

    /** Retrieves potential risks connected to TOIA
     * or BSOIA assets.
     *
     */
    controller.get('potentialRisks', function(req, res){

        //TODO: Return projections and not full paths?
        //TODO: This API is deprecated, will change in v.2.2.0, see http://docs.arangodb.org/Aql/Functions.html
        var query = 'for p in paths(dss_nodes, dss_edges, "outbound", false)' +
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

    }).queryParam("bsoias", {
        description: "A comma-separated list of selected BSOIA assets names",
        type: "string",
        required: false
    }).queryParam("toias", {
        description: "A comma-separated list of selected TOIA assets names",
        type: "string",
        required: false
    });

}());
