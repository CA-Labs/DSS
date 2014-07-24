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
}]);