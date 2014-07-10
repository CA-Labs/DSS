/**
 * Created by Jordi Aranda.
 * 07/07/14
 * <jordi.aranda@bsc.es>
 */

/**
 * ArangoDB service
 *
 * Manages all data retrieval from the
 * ArangoDB database instance.
 */
dssApp.service('ArangoDBService', ['$http', 'AssetsService', function($http, AssetsService){

    //TODO: Fix an stable arangoDB server base URL
    //var ARANGODB_BASE_URL = 'http://109.231.124.30:8529/_db/_system/dss/api/';
    var ARANGODB_BASE_URL = 'http://localhost:8529/_db/_system/dss/api/';

    //FOXX API endpoints
    var FOXX_API = {
        getBSOIA: function(){
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
        },
        getPotentialRisks: function(selectedBsoias, selectedToias){
            //Build correct URL from selectedBsoias/Toias lists
            var firstBsoia = firstToia = true;
            var url = ARANGODB_BASE_URL + 'potentialRisks?';
            _.each(selectedBsoias, function(bsoia){
               if(firstBsoia){
                   firstBsoia = false;
                   url += 'bsoias=' + bsoia.name;
               } else {
                   url += ',' + bsoia.name;
               }
            });
            _.each(selectedToias, function(toia){
               if(firstToia){
                   firstToia = false;
                   url += '&toias=' + toia.asset.name;
               } else {
                   url += ',' + toia.asset.name;
               }
            });
            return url;
        }
    };

    /**
     * Retrieves BSOIA assets from the database.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getBSOIA = function(callback){
        $http({method: 'GET', url: FOXX_API.getBSOIA()})
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

    /**
     * Retrieves potential risks by looking up
     * risks connected to BSOIA or TOIA assets.
     * @param selectedBsoias The BSOIA assets
     * selected by the user to be protected.
     * @param selectedToias The TOIA assets
     * selected by the user to be protected.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getPotentialRisks = function(callback) {
        console.log(AssetsService.getBSOIA());
        console.log(AssetsService.getTA());
        $http({method: 'GET', url: FOXX_API.getPotentialRisks(AssetsService.getBSOIA(), AssetsService.getTA())})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function (data, status, headers, config){
               callback(data, null);
            });
    };

}]);
