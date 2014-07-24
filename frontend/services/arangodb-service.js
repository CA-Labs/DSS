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
dssApp.service('ArangoDBService', ['$http', '$q', 'AssetsService', 'RisksService', function($http, $q, AssetsService, RisksService){

    //TODO: Fix an stable arangoDB server base URL
    //var ARANGODB_BASE_URL = 'http://109.231.124.30:8529/_db/_system/dss/api/';
    var ARANGODB_BASE_URL = 'http://localhost:8529/_db/_system/dss/api/';

    //FOXX API endpoints
    var FOXX_API = {
        getAll: function (url) {
            return ARANGODB_BASE_URL + url
        },
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
        },
        getPotentialTreatments: function(selectedRisks){
            var firstRisk = true;
            var url = ARANGODB_BASE_URL + 'potentialTreatments?';
            _.each(selectedRisks, function(risk){
                if(firstRisk){
                    firstRisk = false;
                    url += 'risks=' + risk.destination.name;
                } else {
                    url += ',' + risk.destination.name
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
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getPotentialRisks = function(callback) {
        $http({method: 'GET', url: FOXX_API.getPotentialRisks(AssetsService.getBSOIA(), AssetsService.getTA())})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function (data, status, headers, config){
               callback(data, null);
            });
    };

    /**
     * Retrieves potential treatments connected to
     * a list of risks.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getPotentialTreatments = function(callback){
        $http({method: 'GET', url: FOXX_API.getPotentialTreatments(RisksService.getRisks())})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function(data, status, headers, config){
                callback(data, null);
            });
    };

    this.getAll = function (urlEndPoint) {
        var deffered = $q.defer();
        $http({
            method: 'GET',
            url: FOXX_API.getAll(urlEndPoint)
        }).success(function (data) {
            deffered.resolve(data);
        }).error(function (err) {
            deffered.reject(err);
        });
        return deffered.promise;
    }

}]);
