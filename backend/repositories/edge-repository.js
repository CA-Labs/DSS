/**
 * Created by Jordi Aranda.
 * 25/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx                    = require('org/arangodb/foxx'),
    ArangoDB                = require('org/arangodb'),
    console                 = require('console'),
    db                      = ArangoDB.db,
    edgesCollection         = ArangoDB.db._collection('edges');

/**
 * TODO: Update methods don't seem available in edge collections. This repository mixes both
 * collection methods and AQL queries to offer complete query capabilites.
 */

var EdgeRepository = Foxx.Repository.extend({
    all: function(){

        var query = "for edge in edges return edge";
        var stmt = db._createStatement({query: query});
        var result = stmt.execute();
        return result._documents;

    },
    saveEdge: function(from, to, type, newEdge){

        var fromAttrs = from.split('/');
        var toAttrs = to.split('/');
        var fromNode = null;
        var toNode = null;

        if(!fromAttrs) {
            return {error: true, reason: 'Invalid from property'};
        } else {
            fromNode = db._collection(fromAttrs[0]).document(fromAttrs[1]);
        }

        if(!toAttrs) {
            return {error: true, reason: 'Invalid to property'};
        } else {
            toNode = db._collection(toAttrs[0]).document(toAttrs[1]);
        }

        if(!fromNode) {
            return {error: true, reason: 'From node not found'};
        } else if(!toNode) {
            return {error: true, reason: 'To node not found'};
        }

        // Before creating the edge, check if it already exists
        var query = "for edge in edges filter edge._from == @from && edge._to == @to && edge.type == @type return edge";
        var stmt = db._createStatement({query: query});
        stmt.bind('from', from);
        stmt.bind('to', to);
        stmt.bind('type', type);
        var result = stmt.execute();

        if(result._documents.length > 0){
            return {error: true, reason: 'Edge from ' + fromAttrs[1] + ' to ' + toAttrs[1] + ' of type ' + type + ' already exists'};
        } else {
            return edgesCollection.save(fromNode, toNode, newEdge);
        }

    },
    getFromTo: function(from, to){

        var query = "for edge in edges filter edge._from==@from && edge._to==@to return edge";
        var stmt = db._createStatement({query: query});
        stmt.bind('from', from);
        stmt.bind('to', to);
        var result = stmt.execute();
        return result._documents;

    },
    updateFromTo: function(from, to, newEdge){

        var query = "for edge in edges filter edge._from==@from && edge._to==@to update edge with @newEdge in edges";
        var stmt = db._createStatement({query: query});
        stmt.bind('from', from);
        stmt.bind('to', to);
        stmt.bind('newEdge', newEdge);
        var result = stmt.execute();
        return result;

    },
    removeFromTo: function(from, to){

        var query = "for edge in edges filter edge._from==@from && edge._to==@to remove edge in edges";
        var stmt = db._createStatement({query: query});
        stmt.bind('from', from);
        stmt.bind('to', to);
        var result = stmt.execute();
        return result;

    }
});

exports.repository = new EdgeRepository(ArangoDB.db._collection('edges'), {});
