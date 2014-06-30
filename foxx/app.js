(function() {
  
  "use strict";
  
  var Foxx = require("org/arangodb/foxx"),
  controller = new Foxx.Controller(applicationContext)

  /** Retrieves all assets by asset type (bsoia/toia/)
   * 
   */      
  controller.get("/assets/:type", function(req, res) {
    var query = "for node in dss_nodes filter node.type == @type return node";
    var stmt = db._createStatement({"query": query});
    stmt.bind("type", req.params("type").toString);
    var result = stmt.execute();
    res.json(result);
  }).pathParam("type", {
    description: "The type of the asset (bsoia/toia)",
    type: "string"
  });
  
  /** Retrieves all risks
   * 
   */
  controller.get("/risks", function(req, res){
    var query = "for node in dss_nodes filter node.type == 'risk' return node";
    var stmt = db._createStatement({"query": query});
    var result = stmt.execute();
    res.json(result);
  });
  
  /** Retrieves all treatments
   * 
   */
  controller.get("/treatments", function(req, res){
    var query = "for node in dss_nodes filter node.type == 'treatment' return node";
    var stmt = db._createStatement({"query": query});
    var result = stmt.execute();
    res.json(result);
  });

}());
