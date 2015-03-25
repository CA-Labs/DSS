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
dssApp.service('ArangoDBService', ['$http', '$q', 'ArangoClient', function($http, $q, ArangoClient){

    this.XSD_SERVICE_BASE_URL = 'http://validate.dss.effortable.com/';

    //Closures
    var self = this;

    //External API endpoints
    this.API = {
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
        ArangoClient.getNodesByType('bsoia')
            .then(function(res){
                callback(null, res);
            }, function(err){
                callback(err, null);
            });
    };

    /**
     * Retrieves TOIA assets from the database.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getTOIA = function(callback){
        ArangoClient.getNodesByType('toia')
            .then(function(res){
                callback(null, res);
            }, function(err){
                callback(err, null);
            });
    };

    /**
     * Retrieves risks from the database.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getRisks = function(callback){
        ArangoClient.getNodesByType('risk')
            .then(function(res){
                callback(null, res);
            }, function(err){
                callback(err, null);
            });
    };

    /**
     * Retrieves treatments from the database.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getTreatments = function(callback) {
        ArangoClient.getNodesByType('treatment')
            .then(function(res){
                callback(null, res);
            }, function(err){
                callback(err, null);
            });
    };

    /**
     * Retrieves potential risks by looking up
     * risks connected to BSOIA or TOIA assets.
     * @param bsoia List of BSOIA assets.
     * @param toia List of TOIA assets.
     * @param useBsoia Whether to start from BSOIA or TOIA assets for paths lookup.
     * @param callback Callback fn to execute
     * on data retrieval.
     */
    this.getPotentialRisks = function(bsoia, toia, useBsoia, callback) {
        if (useBsoia) {
            ArangoClient.getPotentialRisks(bsoia.map(function(asset){ return asset.name.toLowerCase(); }), useBsoia)
                .then(function(res){
                    callback(null, res);
                }, function(err){
                    callback(err, null);
                });
        } else {
            ArangoClient.getPotentialRisks(toia.map(function(t){ return t.asset.name.toLowerCase(); }), useBsoia)
                .then(function(res){
                    callback(null, res);
                }, function(err){
                    callback(err, null);
                });
        }
    };

    /**
     * Retrieves potential treatments connected to
     * a list of risks.
     * @param risks List of risks.
     * @param callback Callback fn to execute.
     * on data retrieval.
     */
    this.getPotentialTreatments = function(risks, callback){
        ArangoClient.getPotentialTreatments(risks.map(function(risk){ return risk.toLowerCase(); }))
            .then(function(res){
                callback(null, res);
            }, function(err){
                callback(err, null);
            });
    };

    /**
     * Retrieves service names.
     */
    this.getServicesWithProviders = function(callback){
        ArangoClient.getServicesWithProviders()
            .then(function(res){
                callback(null, res);
            }, function(err){
                callback(err, null);
            });
    };

    /**
     * Retrieves risks-treatments mapping.
     * @param callback Callback fn to execute on data retrieval.
     */
    this.getRisksTreatmentsMapping = function(callback){
        ArangoClient.getRisksTreatmentsMapping()
            .then(function(res){
                callback(null, res);
            }, function(err){
                callback(err, null);
            });
    };

    /**
     * Retrieves toia-risks mapping.
     * @param callback Callback fn to execute on data retrieval.
     */
    this.getTOIARisksMapping = function(callback){
        ArangoClient.getTOIARisksMapping()
            .then(function(res){
                callback(null, res);
            }, function(err){
                callback(err, null);
            });
    };

    /**
     * Retrieves bsoia-risks mapping.
     * @param callback Callback fn to execute on data retrieval.
     */
    this.getBSOIARisksMapping = function(callback){
        ArangoClient.getBSOIARisksMapping()
            .then(function(res){
                callback(null, res);
            }, function(err){
                callback(err, null);
            });
    };

    /**
     * Retrieves treatments connected to services of a certain cloud and service type.
     * @param callback Callback fn to execute on data retrieval.
     */
    this.getTreatmentsConnectionsPerCloudAndServiceTypes = function(cloudType, serviceType, callback){
        ArangoClient.getTreatmentsConnectionsPerCloudAndServiceTypes(cloudType, serviceType)
            .then(function(res){
                callback(null, res);
            }, function(err){
                callback(err, null);
            });
    };

    /**
     * Get a list of cloud service possibilities given a cloud and service types.
     * @param {string} cloudType The cloud type we are interested in (IaaS,PaaS,SaaS).
     * @param {string} serviceType The service type we are interested in.
     * @returns Service proposal array matching requested criteria.
     */
    this.getProposalsByCloudAndServiceTypes = function(cloudType, serviceType, callback){
        ArangoClient.getProposalsByCloudAndServiceTypes(cloudType, serviceType)
            .then(function(res){
                callback(null, res);
            }, function(err){
                callback(err, null);
            });
    };

    /**
     * Returns the migration values for all services.
     * @param callback
     */
    this.getServicesMigrationValues = function(callback){
        ArangoClient.getServicesMigrationValues()
            .then(function(res){
                var services = res.map(function(service){ return {name: service.service, values: service.edges.map(function(edge){ return edge.value})}});
                var result = {};
                _.each(services, function(service){
                    result[service.name] = service.values.reduce(function(previous, next){
                            return previous + next;
                        }, 0) / (service.values.length || 1)
                });
                callback(null, result);
            }, function(err){
                callback(err, null);
            });
    };

    /**
     * Validates a cloud descriptor XML file using server-side validation
     * @param xmlString XML string to validate.
     * @param callback Callback fn to execute.
     */
    this.validateSchema = function(xmlString, callback){
        $http({method: 'POST', url: self.API.validateDocument(), data: {xmlString: xmlString}})
            .success(function (data) {
                callback(null, data);
            })
            .error(function (err) {
                callback(err, null);
            });
    };

}]);
