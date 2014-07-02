/**
 * Created by Jordi Aranda.
 * 01/07/14
 * <jordi.aranda@bsc.es>
 */

/**
 * ArangoDB service
 *
 * Manages all data retrieval from the
 * ArangoDB database instance.
 */
dssApp.service('ArangoDBService', ['$http', function($http){
  
    //TODO: Fix an stable arangoDB server base URL
    var ARANGODB_BASE_URL = 'http://109.231.124.30:8529/_db/_system/dss/';

    //FOXX API endpoints
    var FOXX_API = {
        getBSOA: function(){
                return ARANGODB_BASE_URL + 'assets/bsoia'
        },
        getTOIA: function(){
            return ARANGODB_BASE_URL + 'assets/toia'
        },
        getRisks: function(){
            return ARANGODB_BASE_URL + 'risks';
        },
        getTreatments: function(){
            return ARANGODB_BASE_URL + 'treatments';
        }
    };

    /**
     * Retrieves BSOA assets from the database.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getBSOA = function(callback){
        $http({method: 'GET', url: FOXX_API.getBSOA()})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function(data, status, headers, config){
                callback(data, null);
            });
    };

    /**
     * Retrieves TOIA assets from the database.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getTOIA = function(callback){
        $http({method: 'GET', url: FOXX_API.getTOIA()})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function(data, status, headers, config){
                callback(data, null);
            });
    };

    /**
     * Retrieves risks from the database.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getRisks = function(callback){
        $http({method: 'GET', url: FOXX_API.getRisks()})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function(data, status, headers, config){
                callback(data, null);
            });
    };

    /**
     * Retrieves treatments from the database.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getTreatments = function(callback) {
        $http({method: 'GET', url: FOXX_API.getTreatments()})
            .success(function (data, status, headers, config) {
                callback(null, data);
            })
            .error(function (data, status, headers, config) {
                callback(data, null);
            });
    };
  
}]);
