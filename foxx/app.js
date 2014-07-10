(function() {
  
    'use strict';

    var Foxx = require('org/arangodb/foxx'),
    controller = new Foxx.Controller(applicationContext),
    arango = require('org/arangodb'),
    db = arango.db;

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
        var query = 'for p in paths(dss_nodes, dss_edges, "outbound", false)' +
                    'filter (p.source.type == "bsoia" || p.source.type == "toia")' +
                    ' && p.destination.type == "risk"' +
                    ' && (p.source.name in [@bsoias] || p.source.name in [@toias])' +
                    'return p';
        var stmt = db._createStatement({query: query});

        var bsoias = '';
        var toias = '';

        if(req.params('bsoias') !== null && typeof req.params('bsoias') !== 'undefined'){
            bsoias = _.map(req.params('bsoias').split(','), function(bsoia, index){
                if(index == 0){
                    return '"' + bsoia + '"';
                } else {
                    return ',' + '"' + bsoia + '"';
                }
            });
            console.log('Bsoias computed', bsoias);
        }
        stmt.bind('bsoias', bsoias);

        if(req.params('toias') !== null && typeof req.params('toias') !== 'undefined'){
            toias = _.map(req.params('toias').split(','), function(toia, index){
               if(index == 0){
                   return '"' + toia + '"';
               } else {
                   return ',' + '"' + toia + '"';
               }
            });
            console.log('Toias computed', toias);
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
