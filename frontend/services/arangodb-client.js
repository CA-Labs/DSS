/**
 * Created by Jordi Aranda
 * 12/16/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('ArangoClient', ['$q', function($q){

    /******************************************************************
     ************************** INITIALIZATION ************************
     ******************************************************************/

    var host = 'db.dss.effortable.com';
    var db = 'dss';

    var db = new arango.Connection({_name: db, _server: {hostname: host, port: 80}});

    /**
     * Tries to create a user-defined AQL function.
     * @param fnName The function name.
     * @param fn The function body.
     * @returns {Promise}
     */
    var createAQLfunction = function(fnName, fn){
        return db.post('/_api/aqlfunction', {name: fnName, code: String(fn)});
    };

    // Initialization code goes here: collections check, user-defined AQL functions, etc.
    var init = function(){
        $q.all([
            // Used in the service graph query for grouping providers by services and characteristic values
            createAQLfunction('dss::utils::pathsToCharacteristicValues', function(paths){
                return paths.map(function(path){
                    return {
                        name: path.vertices[2].name ,
                        value: path.edges[1].hasOwnProperty('data') ? path.edges[1].data.hasOwnProperty('value') ? path.edges[1].data.value : 0 : 0,
                        max: path.edges[1].hasOwnProperty('data') ? path.edges[1].data.hasOwnProperty('max') ? path.edges[1].data.max : 1 : 1
                    }
                })
            })
        ]).then(function(){
            //console.log('ArangoDB initialization checks completed.');
        }, function(err){
            console.log('ArangoDB initialization checks failed, reason:', err);
        });
    };

    init();

    /******************************************************************
     **************************** DB METHODS **************************
     ******************************************************************/

    /**
     * Retrieves nodes by type.
     * @param nodeType The node type (bsoia, toia, risk, ...).
     * @returns {Promise}
     */
    this.getNodesByType = function(nodeType){
        var query = 'for n in nodes filter n.type == @nodeType return n';
        return db.query.exec(query, {nodeType: nodeType});
    };

    /**
     * Retrieves list of potential risks.
     * @param fromToias An array containing valid TOIA asset names.
     * @returns {Promise}
     */
    this.getPotentialRisks = function(fromToias){
        var query = 'for p in graph_paths("dssBlueprints", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1})' +
                    'let sourceType = (p.source.type)' +
                    'let destinationType = (p.destination.type)' +
                    'let sourceName = (lower(p.source.name))' +
                    'filter ((sourceType == "toia") && (destinationType == "risk") && (position(@toias, sourceName) != -1))' +
                    'return p';
        return db.query.exec(query, {toias: fromToias});
    };

    /**
     * Retrieves list of potential treatments.
     * @param fromRisks An array containing valid risk names.
     * @returns {Promise}
     */
    this.getPotentialTreatments = function(fromRisks){
        var query = 'for p in graph_paths("dssBlueprints", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1}) ' +
                    'let sourceType = (p.source.type) ' +
                    'let destinationType = (p.destination.type) ' +
                    'let sourceName = (lower(p.source.name)) ' +
                    'filter (sourceType == "risk") && (destinationType == "treatment") && (position(@risks, sourceName) != -1) ' +
                    'collect risk = p.source.name into risks ' +
                    'return {risk: risk, treatments: risks[*].p.destination}';
        return db.query.exec(query, {risks: fromRisks});
    };

    /**
     * Retrieves risks - treatments mapping.
     * @returns {Promise}
     */
    this.getRisksTreatmentsMapping = function(){
        var query = 'for p in graph_paths("dssBlueprints", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1}) ' +
                    'let sourceType = (p.source.type) ' +
                    'let destinationType = (p.destination.type) ' +
                    'let sourceName = (lower(p.source.name)) ' +
                    'filter (sourceType == "risk") && (destinationType == "treatment") ' +
                    'collect risk = (p.source.name) into treatments ' +
                    'return {risk: risk, treatments: treatments[*].p.destination.name}';
        return db.query.exec(query);
    };

    /**
     * Retrieves TOIA assets - risks mapping.
     * @returns {Promise}
     */
    this.getTOIARisksMapping = function(){
        var query = 'for p in graph_paths("dssBlueprints", {direction: "outbound", followCycles: false, minLength: 1, maxLength: 1}) ' +
                    'let sourceType = (p.source.type) ' +
                    'let destinationType = (p.destination.type) ' +
                    'let sourceName = (lower(p.source.name)) ' +
                    'filter (sourceType == "toia") && (destinationType == "risk") ' +
                    'collect toia = (p.source.name) into risks ' +
                    'return {toia: toia, risks: risks[*].p.destination.name}';
        return db.query.exec(query);
    };

    /**
     * Retrieves treatments per cloud and service types.
     * @param cloudType The cloud type.
     * @param serviceType The service type.
     * @returns {Promise}
     */
    this.getTreatmentsConnectionsPerCloudAndServiceTypes = function(cloudType, serviceType){
        var query = 'for p in graph_paths("dssBlueprints", {direction: "outbound", followCycles: false, minLength: 2, maxLength: 2}) ' +
                    'let sourceType = (p.source.type) ' +
                    'let destinationType = (p.destination.type) ' +
                    'filter (sourceType == "service") && (destinationType == "treatment") && (p.source.cloudType == @cloudType) && (p.source.serviceType == @serviceType) ' +
                    'collect cloud = (p.source.cloudType), ' +
                    'service = (p.source.serviceType), ' +
                    'treatments = (p.destination.name) into paths ' +
                    'return {cloud: cloud, service: service, treatments: treatments, numServices: length(paths)}';
        return db.query.exec(query, {cloudType: cloudType, serviceType: serviceType});
    };

    /**
     * Retrieves proposals by cloud and service types.
     * @param cloudType The cloud type.
     * @param serviceType The service type.
     * @returns {Promise}
     */
    this.getProposalsByCloudAndServiceTypes = function(cloudType, serviceType){
        var query = 'for path in graph_paths("dssBlueprints", {direction: "outbound", followCycles: false, minLength: 3, maxLength: 3}) ' +
                    'let sourceType = path.source.type ' +
                    'let destinationType = path.destination.type ' +
                    'let cloudType = path.vertices[1].cloudType ' +
                    'let serviceType = path.vertices[1].serviceType ' +
                    'filter (sourceType == "provider") && (destinationType == "treatment") && (cloudType == @cloudType) && (serviceType == @serviceType) ' +
                    'collect service = path.vertices[1],' +
                    'provider = path.source,' +
                    'providerName = path.source.name into providers ' +
                    'return {provider: provider, service: service, characteristics: dss::utils::pathsToCharacteristicValues(providers[*].path)}';
        return db.query.exec(query, {cloudType: cloudType, serviceType: serviceType});
    };

}]);
