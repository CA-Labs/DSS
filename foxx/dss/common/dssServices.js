dssApp.service("ArangoDBService", ['$http', function($http){
  
  //TODO: Fix an stable arangoDB server base URL
  var ARANGODB_BASE_URL = "http://109.231.124.30:8529/_db/_system/dss/";
  
  var DSS_API = {
    getBSOA: function(){
      return ARANGODB_BASE_URL + "assets/bsoa"
    },
    getTOIA: function(){
      return ARANGODB_BASE_URL + "assets/toia"
    },
    getRisks: function(){
      return "TODO";
    },
    getTreatments: function(){
      return "TODO";
    }
  }

  this.getBSOA = function(callback){
    $http({method: 'GET', url: DSS_API.getBSOA()})
      .success(function(data, status, headers, config){
        callback(null, data);
      })
      .error(function(data, status, headers, config){
        callback(data, null);
      });
  };
    
  this.getTOIA = function(callback){
    //TODO:
    return {status: "TODO"}; 
  };
    
  this.getRisks = function(callback){
    //TODO:
    return {status: "TODO"};
  };
  
  this.getTreatments = function(callback){
    //TODO:
    return {status: "TODO"};
  };
  
}]);
