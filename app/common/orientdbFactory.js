dssApp.factory('orientdbFactory', function () {

    var methods = {};

    methods.getMatching = function (query) {
        var results = $resource('/query/:collection');
        return query; // TODO: make connector to orientdb to run the query
    };

    return methods;
});