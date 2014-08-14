/**
 * DSS Crud Operations Controller
 * @author: Jacek Dominiak
 * @copyright: Jacek Dominiak
 * @created: 24/07/14
 */

//Show/hide x (close button) when hovering selected bsoia tags in drop zones
$('body').on('mouseover', '.form-group > .dropzone-container', function(e){
    $(this).find('.remove-bsoia-in-toia-asset').show();
});

$('body').on('mouseout', '.form-group > .dropzone-container', function(e){
    $(this).find('.remove-bsoia-in-toia-asset').hide();
});


//var dssApp = angular.module('dssApp', [
//    'angular-flash.service',
//    'angular-flash.flash-alert-directive',
//    'ngDragDrop'
//]);

dssApp.controller('crudController', ['$scope', 'ArangoDBService', function ($scope, ArangoDBService) {

    $scope.modifyExisting = false;

    // Initialize save object
    $scope.characteristicData = {};
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

    ArangoDBService.getAll('characteristic', function (err, data) {
        $scope.characteristics = data;
    });

    // characteristic levels
    $scope.characteristicLevels = {
        1: "1st level",
        2: "2nd level",
        3: "3rd level"
    };

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
                    "provider": $scope.serviceData.provider,
                    "cloudType": $scope.serviceData.cloudType,
                    "metrics": $scope.metricsValues
                };
                ArangoDBService.save('service', dataToSend).then(function () {
                    window.location.reload();
                }, function (err) {
                    $scope.error = err;
                });
                break;
            case "metric":
                data.type = "metric";
                if ($scope.modifyExisting) {
                    ArangoDBService.update($scope.chosenMetric._id, data).then(function () {
                        window.location.reload();
                    }, function (err) {
                        $scope.error = err;
                    });
                } else {
                    ArangoDBService.save('metric', data).then(function () {
                        window.location.reload();
                    }, function (err) {
                        $scope.error = err;
                    });
                }
                break;
            case "provider":
                data.type = "provider";
                ArangoDBService.save('provider', data).then(function () {
                    window.location.reload();
                }, function (err) {
                    $scope.error = err;
                });
                break;
            case "characteristic":
                var data = {
                    name: $scope.characteristicData.name,
                    source: $scope.characteristicData.source,
                    level: $scope.characteristicData.level,
                    formula: $scope.characteristicData.formula.split(','),
                    type: "characteristic",
                    metrics: $scope.characteristicData.metrics
                };
                if ($scope.modifyExisting) {
                    ArangoDBService.update($scope.characteristicData._id, data).then(function () {
                        window.location.reload();
                    }, function (err) {
                        $scope.error = err;
                    });
                } else {
                    ArangoDBService.save('characteristic', data).then(function () {
                        window.location.reload();
                    }, function (err) {
                        $scope.error = err;
                    });
                }
                break;
        }
    };

    $scope.clearForm = function (formType) {
        switch (formType) {
            case 'metric':
                $scope.metricData = {};
                $scope.modifyExisting = false;
                break;
            case 'characteristic':
                $scope.characteristicData = {};
                $scope.modifyExisting = false;
                break;
        }
    };

    $scope.chosenMetric = {};
    $scope.chosenCharacteristic = {};

    $scope.updateForm = function (formType) {
        switch (formType) {
            case 'metric':
                $scope.modifyExisting = true;
                $scope.metricData.name = $scope.chosenMetric.name;
                $scope.metricData.options = JSON.stringify($scope.chosenMetric.options);
                break;
            case 'characteristic':
                $scope.modifyExisting = true;
                $scope.characteristicData.name = $scope.chosenCharacteristic.name;
                $scope.characteristicData.source = $scope.chosenCharacteristic.source;
                $scope.characteristicData.level = $scope.chosenCharacteristic.level;
                $scope.characteristicData.formula = JSON.stringify($scope.chosenCharacteristic.formula);
                $scope.characteristicData.metrics = $scope.chosenCharacteristic.metrics;
                break;
        }
    };

    // init
    $scope.characteristicData.metrics = [];

    $scope.addMetricToCharacteristic = function ($event, $data) {
        $scope.characteristicData.metrics.push($data.name);
    };

    $scope.removeMetricFromCharactersitic = function (metric) {
        delete $scope.characteristicData.metrics[metric.name];
    };
}]);