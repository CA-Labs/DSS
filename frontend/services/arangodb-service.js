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

    //Set Authorization header
    $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa('root:CATech2014!');

    //TODO: Fix an stable arangoDB server base URL
    //var ARANGODB_BASE_URL = 'http://109.231.124.30:8529/_db/_system/dss/api/';
    this.ARANGODB_BASE_URL = 'http://dss.jarandaf.com:8529/_db/dss/dss/';
    this.XSD_SERVICE_BASE_URL = 'http://dss.jarandaf.com:3999/';

    //Closures
    var self = this;

    //FOXX API endpoints
    this.FOXX_API = {
        getUrl: function (url) {
            return self.ARANGODB_BASE_URL + 'crud/nodes/' + url
        },
        postUrl: function () {
            return self.ARANGODB_BASE_URL + 'crud/nodes';
        },
        getBSOIA: function(){
            return self.ARANGODB_BASE_URL + 'crud/nodes/bsoia'
        },
        getTOIA: function(){
            return self.ARANGODB_BASE_URL + 'crud/nodes/toia'
        },
        getRisks: function(){
            return self.ARANGODB_BASE_URL + 'crud/nodes/risk';
        },
        getTreatments: function(){
            return self.ARANGODB_BASE_URL + 'crud/nodes/treatment';
        },
        getPotentialRisks: function(selectedBsoias, selectedToias){
            //Build correct URL from selectedBsoias/Toias lists
            var firstBsoia = firstToia = true;
            var url = self.ARANGODB_BASE_URL + 'graph/potentialRisks?';
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
            var url = self.ARANGODB_BASE_URL + 'graph/potentialTreatments?';
            _.each(selectedRisks, function(risk){
                if(firstRisk){
                    firstRisk = false;
                    url += 'risks=' + risk.destination.name;
                } else {
                    url += ',' + risk.destination.name
                }
            });
            return url;
        },
        validateDocument: function(){
            return self.XSD_SERVICE_BASE_URL + 'validateDSSXML';
        }
    };

    /**
     * Retrieves BSOIA assets from the database.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getBSOIA = function(callback){
        $http({method: 'GET', url: self.FOXX_API.getBSOIA()})
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
        $http({method: 'GET', url: self.FOXX_API.getTOIA(), headers: {}})
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
        $http({method: 'GET', url: self.FOXX_API.getRisks()})
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
        $http({method: 'GET', url: self.FOXX_API.getTreatments()})
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
        $http({method: 'GET', url: self.FOXX_API.getPotentialRisks(AssetsService.getBSOIA(), AssetsService.getTA())})
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
        $http({method: 'GET', url: self.FOXX_API.getPotentialTreatments(RisksService.getRisks())})
            .success(function(data, status, headers, config){
                callback(null, data);
            })
            .error(function(data, status, headers, config){
                callback(data, null);
            });
    };

    /**
     * Get all the data from the given url API endpoint
     * @param {string} urlEndPoint - valid url end point
     * @returns {promise}
     */
    this.getAll = function (urlEndPoint, callback) {
        $http.get(self.FOXX_API.getUrl(urlEndPoint)).success(function (data) {
            callback(null, data);
        }).error(function (err) {
            callback(err, null);
        });
    };

    /**
     * Get a list of cloud service possibilities given a list of treatments.
     * @returns
     */
    this.getProposals = function(treatments){
        //TODO: By now, we just return a mock to fill in the view
        return [
            {
                name: 'Windows Azure',
                description: 'A brief and fancy description #1',
                url: 'http://azure.microsoft.com',
                logo: 'http://blog.alebanzas.com.ar/wp-content/uploads/2011/08/7217.Windows-Azure-logo-v_6556EF52.png',
                score: 81.8
            },
            {
                name: 'Amazon EC2',
                description: 'A brief and fancy description #2',
                url: 'http://aws.amazon.com',
                logo: 'http://zentera.net/wp-content/uploads/2013/08/AWSLogo.png',
                score: 75.2
            },
            {
                name: 'Rackspace',
                description: 'A brief and fancy description #3',
                url: 'http://www.rackspace.com',
                logo: 'http://www.hatchpitch.com/wp-content/uploads/2013/03/Rackspace_Cloud_Company_Logo_clr.png',
                score: 43.5
            }
        ];
    };

    /**
     * Save new object
     * @param {string} urlEndPoint - valid url end point
     * @param {object} data - data to be saved
     * @returns {promise}
     */
    this.save = function (urlEndPoint, data) {
        var deffered = $q.defer();
        $http.post(self.FOXX_API.postUrl(), data).success(function (data) {
            deffered.resolve(data);
        }).error(function (err) {
            deffered.reject(err);
        });

        return deffered.promise;
    };

    /**
     * Update existing object
     * @param {string} urlEndPoint - valid url end point - need to contain the key
     * @param {object} data - data to be saved
     * @returns {promise}
     */
    this.update = function (urlEndPoint, data) {
        var deffered = $q.defer();
        $http.put(self.FOXX_API.getUrl(urlEndPoint), data).success(function (data) {
            deffered.resolve(data);
        }).error(function (err) {
            deffered.reject(err);
        });

        return deffered.promise;
    };

    /**
     * Validates a cloud descriptor XML file using server-side validation
     * @param xmlString XML string to validate.
     * @param callback Callback fn to execute.
     */
    this.validateSchema = function(xmlString, callback){
        $http({method: 'POST', url: self.FOXX_API.validateDocument(), data: {xmlString: xmlString}})
            .success(function (data) {
                callback(null, data);
            })
            .error(function (err) {
                callback(err, null);
            });
    };

}]);
