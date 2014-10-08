(function() {

    'use strict';

    var Foxx            = require('org/arangodb/foxx'),
        controller      = new Foxx.Controller(applicationContext),
        arango          = require('org/arangodb'),
        db              = arango.db,
        console         = require("console");

    /**
     * Stores a user cloud service selection.
     */
    controller.post('/session', function(req, res){
        var session = req.body();
        // No validation carried out, save session objects as they are
        db._collection('session').save(session);
    });

    // TODO: Add more endpoints if required

})();
