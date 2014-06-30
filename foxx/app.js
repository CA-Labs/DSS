(function() {
    "use strict";

    var Foxx = require("org/arangodb/foxx"),
        controller = new Foxx.Controller(applicationContext)

    controller.get("/hello/:name", function(req, res) {
        res.set("Content-Type", "text/plain");
        res.body = "Hello " + req.params("name");
    });

}());
