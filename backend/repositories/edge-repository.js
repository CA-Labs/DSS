/**
 * Created by Jordi Aranda.
 * 25/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx                    = require('org/arangodb/foxx'),
    ArangoDB                = require('org/arangodb'),
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
    save: function(from, to, newEdge){
        return edgesCollection.save(from, to, newEdge);
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

exports.repository = new EdgeRepository(ArangoDB.db._collection('edges'));
