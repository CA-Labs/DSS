/**
 * Created by Jordi Aranda.
 * 05/08/14
 * <jordi.aranda@bsc.es>
 */

/***************************************************************************
 ****************************** UTILS FOR TESTS ****************************
 ***************************************************************************/

// ArangoDB test database instance
var ARANGODB_TEST_BASE_URL = 'http://localhost:8529/_db/test/dss/';

// Crud API endpoints
var API = {
    DROP_NODES: function(){
        return ARANGODB_TEST_BASE_URL + 'crud/nodes/all';
    },
    DROP_EDGES: function(){
        return ARANGODB_TEST_BASE_URL + 'crud/edges/all';
    },
    GET_NODES: function(type){
        return ARANGODB_TEST_BASE_URL + 'crud/nodes/' + type;
    },
    GET_NODE_BY_ID: function(_id){
        return ARANGODB_TEST_BASE_URL + 'crud/nodes/' + _id;
    },
    UPDATE_NODE_BY_ID: function(_id){
        return ARANGODB_TEST_BASE_URL + 'crud/nodes/' + _id;
    },
    DELETE_NODE_BY_ID: function(_id){
        return ARANGODB_TEST_BASE_URL + 'crud/nodes/' + _id;
    },
    POST_NODES: function(){
        return ARANGODB_TEST_BASE_URL + 'crud/nodes';
    },
    DELETE_NODES: function(type){
        return ARANGODB_TEST_BASE_URL + 'crud/nodes/' + type;
    },
    GET_EDGES: function(){
        return ARANGODB_TEST_BASE_URL + 'crud/edges'
    },
    GET_EDGE_FROM_TO: function(_from, _to){
        return ARANGODB_TEST_BASE_URL + 'crud/edges/' + _from + '/' + _to
    },
    POST_EDGES: function(_from, _to){
        return ARANGODB_TEST_BASE_URL + 'crud/edges/' + _from + '/' + _to;
    },
    UPDATE_FORMULA: function(_id){
        return ARANGODB_TEST_BASE_URL + 'crud/nodes/' + _id + '?updateFormula=true';
    },
    UPDATE_METRIC: function(_from, _to){
        return ARANGODB_TEST_BASE_URL + 'graph/updateMetric?metricName=' + _from + '&serviceName=' + _to;
    }
};

// Helper function for ajax calls
var baseAJAX = function(type, url, async, data, success, error){
    /*
    console.debug('type', type);
    console.debug('url', url);
    console.debug(data);
    */
    $.ajax({
        type: type,
        url: url,
        async: true,
        data: data ? JSON.stringify(data) : null,
        dataType: 'json',
        contentType: 'json',
        success: success,
        error: error,
        beforeSend: function(xhr){
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa('root:CATech2014!'));   //DB user/password authentication
        }
    });
};
