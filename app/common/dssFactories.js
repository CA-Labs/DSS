/**
 * Local config holder for the factories. At this point it only holds the http url parts for the back end.
 * I guess at some point socket io client config might be added here.
 * @type {{http: {beProto: string, beHost: string, bePort: string}}}
 */
var config = {
    http: {
       beProto: 'http',
       beHost: window.location.hostname,
       bePort: '3003'
    }
};

/**
 * Factory which is used for retrival of the data from the database. At this point only
 * GET,PUT,POST,DELETE cors options are enabled. If any additional is needed, it should be enabled in the cors section
 * of the back end service.js file
 */
dssApp.factory('orientdbFactory', function ($http   ) {

    var methods = {};
    var host = config.http.beProto + "://" + config.http.beHost + ":" + config.http.bePort + "/";

    methods.getMatching = function (collection, query, callback) {
//        $http.get(host + "query" + "/" + collection, {data: query}).success(callback);
        $http({
            url: host + "query" + "/" + collection,
            method: "GET",
            params: query
        }).success(callback);
    };

    return methods;
});

/**
 * This factory should hold the functions which are used accross different controllers for manipulating, parsing and
 * preparing the data
 */
dssApp.factory('helper', function (){

    var methods = {};

    /**
     * Filters down selected attribute from the list of objects
     * @param objectsList // object or array
     * @param attributeName
     * @returns {Array} // with list of atributeName only
     */
    methods.selectAttributeFromObjects = function (objectsList, attributeName) {
        var listSelected = [];
        angular.forEach(objectsList, function (objectValue) {
            this.push(objectValue[attributeName]);
        }, listSelected);
        return listSelected;
    };

    return methods;
});
