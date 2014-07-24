/**
 * DSS Crud Operations Controller
 * @author: Jacek Dominiak
 * @copyright: Jacek Dominiak
 * @created: 24/07/14
 */

var dssApp = angular.module('dssApp', [
    'angular-flash.service',
    'angular-flash.flash-alert-directive'
]);

dssApp.controller('crudController', ['$scope', 'ArangoDBService', function ($scope, ArangoDBService) {
    // Initialize save object
    $scope.providerData = {};
    $scope.metricData = {};
    $scope.serviceData = {};

    // Get the data from the database
//    $scope.provider = ArangoDBService.getAll('node/provider');
//    $scope.metric = ArangoDBService.getAll('node/metric');

    // Views switch {
    $scope.showServicePanel = true;
    $scope.showMetricPanel = false;
    $scope.showProviderPanel = false;

    $scope.switchPanel = function (panelName) {
        switch(panelName) {
            case "metric":
                $scope.showServicePanel = false;
                $scope.showProviderPanel = false;
                $scope.showMetricPanel = true;
                break;
            case "provider":
                $scope.showServicePanel = false;
                $scope.showMetricPanel = false;
                $scope.showProviderPanel = true;
                break;
            case "service":
            default:
                $scope.showMetricPanel = false;
                $scope.showProviderPanel = false;
                $scope.showServicePanel = true;
                break;
        }
    }
    // }

    $scope.maxYear = new Date().getFullYear();

    $scope.isValidObject = function (data) {
        try {
            var object = JSON.parse(data);
        } catch (err) {
            return false;
        }
        return (typeof object == "object");
    };

    $scope.saveForm = function (objectType, data) {

    };
}]);