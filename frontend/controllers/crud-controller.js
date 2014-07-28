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

dssApp.controller('crudController', ['$scope', 'ArangoDBService', '$http', function ($scope, ArangoDBService, $http) {
    // Initialize save object
    $scope.providerData = {};
    $scope.metricData = {};
    $scope.serviceData = {};

    // Get the data from the database
    ArangoDBService.getAll('provider', function (err, data) {
        $scope.providers = data;
    });

    $scope.metricsValues = {};

    $scope.$watch('metricsValues', function (value) {
        console.log(value);

    }, true);

    ArangoDBService.getAll('metric', function (err, data) {
        $scope.metrics = data;
    });

    // Views switch {
    $scope.showAssetPanel = false;
    $scope.showRiskPanel = false;
    $scope.showTreatmentPanel = false;
    $scope.showCharacteristicPanel = false;
    $scope.showServicePanel = true;
    $scope.showMetricPanel = false;
    $scope.showProviderPanel = false;

    $scope.switchPanel = function (panelName) {
        switch(panelName) {
            case "asset":
                $scope.showRiskPanel = false;
                $scope.showTreatmentPanel = false;
                $scope.showCharacteristicPanel = false;
                $scope.showServicePanel = false;
                $scope.showProviderPanel = false;
                $scope.showMetricPanel = false;
                $scope.showAssetPanel = true;
                break;
            case "risk":
                $scope.showTreatmentPanel = false;
                $scope.showCharacteristicPanel = false;
                $scope.showServicePanel = false;
                $scope.showProviderPanel = false;
                $scope.showMetricPanel = false;
                $scope.showAssetPanel = false;
                $scope.showRiskPanel = true;
                break;
            case "treatment":
                $scope.showCharacteristicPanel = false;
                $scope.showServicePanel = false;
                $scope.showProviderPanel = false;
                $scope.showMetricPanel = false;
                $scope.showAssetPanel = false;
                $scope.showRiskPanel = false;
                $scope.showTreatmentPanel = true;
                break;
            case "characteristic":
                $scope.showServicePanel = false;
                $scope.showProviderPanel = false;
                $scope.showMetricPanel = false;
                $scope.showAssetPanel = false;
                $scope.showRiskPanel = false;
                $scope.showTreatmentPanel = false;
                $scope.showCharacteristicPanel = true;
                break;
            case "metric":
                $scope.showAssetPanel = false;
                $scope.showRiskPanel = false;
                $scope.showTreatmentPanel = false;
                $scope.showCharacteristicPanel = false;
                $scope.showServicePanel = false;
                $scope.showProviderPanel = false;
                $scope.showMetricPanel = true;
                break;
            case "provider":
                $scope.showAssetPanel = false;
                $scope.showRiskPanel = false;
                $scope.showTreatmentPanel = false;
                $scope.showCharacteristicPanel = false;
                $scope.showServicePanel = false;
                $scope.showMetricPanel = false;
                $scope.showProviderPanel = true;
                break;
            case "service":
            default:
                $scope.showAssetPanel = false;
                $scope.showRiskPanel = false;
                $scope.showTreatmentPanel = false;
                $scope.showCharacteristicPanel = false;
                $scope.showMetricPanel = false;
                $scope.showProviderPanel = false;
                $scope.showServicePanel = true;
                break;
        }
    };
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
        switch (objectType) {
            case "service":
                var dataToSend = {
                    "name": data.name,
                    "type": "service",
                    "serivceType": data.cloudType,
                    "metrics": $scope.metricsValues
                };
                ArangoDBService.save('service', data).then(function () {
                    $scope.serviceData = {};
                    $scope.metricsValues = {};
                }).error(function (err) {
                    $scope.error = err;
                });
                break;
            case "metric":
                data.type = "metric";
                ArangoDBService.save('metric', data).then(function () {
                    $scope.metricData = {};
                }).fail(function () {
                    $scope.error = err;
                });
                break;
            case "provider":
                data.type = "provider";
                $http.put('/node/provider', data).success(function () {
                    $scope.providerData = {};
                }).error(function (err) {
                    $scope.error = err;
                });
                break;
        }
    };
}]);