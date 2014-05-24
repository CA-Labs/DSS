var config = {
    http: {
       beProto: 'http',
       beHost: 'localhost',
       bePort: '3003'
    }
};

dssApp.factory('orientdbFactory', function ($http   ) {

    var methods = {};
    var host = config.http.beProto + "://" + config.http.beHost + ":" + config.http.bePort + "/";

    methods.getMatching = function (collection, query, callback) {
        $http.get(host + "query" + "/" + collection, query).success(callback);
    };

    return methods;
});
