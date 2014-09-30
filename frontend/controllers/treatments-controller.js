/**
 * Created by Jordi Aranda.
 * 22/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('treatmentsController', ['$scope', '$rootScope', 'ArangoDBService', 'RisksService', 'AssetsService', 'TreatmentsService', 'flash', '$timeout', 'localStorageService'
    , function($scope, $rootScope, ArangoDBService, RisksService, AssetsService, TreatmentsService, flash, $timeout, localStorageService) {

    $scope.taAssets = AssetsService.getTA();                                        // The list of the TA assets

    $scope.potentialTreatments = [];                                                // The list of potential treatments
    $scope.potentialTreatmentsGrouped = [];

    $scope.treatmentsSelected = TreatmentsService.getTreatments();                  // The list of selected treatments
    localStorageService.bind($scope, 'treatmentsSelected', $scope.treatmentsSelected);

    $scope.treatmentValues = TreatmentsService.getTreatmentsValues();               // The treatments values model
    localStorageService.bind($scope, 'treatmentValues', $scope.treatmentValues);

    $scope.risksTreatmentsMapping = TreatmentsService.getRisksTreatmentsMapping();

    $scope.treatmentsBoundModels = {};

    $scope.showTreatmentValues = TreatmentsService.getShowTreatmentsValues();
    localStorageService.bind($scope, 'showTreatmentValues', $scope.showTreatmentValues);

    /**
     * Event received when the unaccepted risks change, so that
     * the list of potential treatments can be recomputed.
     */
    $scope.$on('risksSelectedChanged', function () {

        // Retrieve all unaccepted risks
        var unacceptableRisksPerTA = RisksService.getUnacceptableRisks();
        var unacceptableRiskNames = [];
        _.each(unacceptableRisksPerTA, function (value, key) {
            _.each(value, function (riskName) {
                if (unacceptableRiskNames.indexOf(riskName) == -1) {
                    unacceptableRiskNames.push(riskName);
                }
            });
        });

        ArangoDBService.getPotentialTreatments(unacceptableRiskNames, function (error, data) {
            if (error) {
                flash.error = 'Some error occurred when trying to compute potential treatments after unacceptable risks changed';
            } else {
                var aux = [];
                _.each(data._documents, function (riskTreatments) {
                    var treatments = riskTreatments.treatments;
                    _.each(treatments, function (treatment) {
                        if (_.filter(aux, function (e) {
                            return e.name == treatment.name;
                        }).length == 0) {
                            aux.push(treatment);
                        }
                    });
                });
                $scope.potentialTreatments = aux;
                $scope.potentialTreatmentsGrouped = [];
                _.each($scope.potentialTreatments, function (potentialTreatment) {
                    var mitigatedRisks = $scope.mitigatedRisks(potentialTreatment.name);
                    _.each(mitigatedRisks, function (mitigatedRisk) {
                        $scope.potentialTreatmentsGrouped.push({treatment: potentialTreatment, group: mitigatedRisk});
                    });
                });
            }
        });

    });

    /**
     * Every time the list of selected treatments changes, we should update the treatments
     * values model, since it doesn't change automatically and also retrieve new service proposals.
     */
    $scope.$watch(function () {
        return TreatmentsService.getTreatments();
    }, function (newTreatments, oldTreatments) {

        // If we are loaading treatments from local storage, don't update treatments models
        if (TreatmentsService.isLoadingTreatmentsFromLocalStorage()) {
            TreatmentsService.loadingTreatmentsFromLocalStorage(false);
            $scope.treatmentsSelected = newTreatments;
            return;
        }

        //Update treatments values model
        var keysToRemove = [];
        _.each(oldTreatments, function (oldTreatment) {
            var found = false;
            _.each(newTreatments, function (newTreatment) {
                if (newTreatment.name == oldTreatment.name) {
                    found = true;
                }
                ;
            });
            if (!found) {
                keysToRemove.push(oldTreatment.name);
            }
        });

        //Remove keys
        _.each(keysToRemove, function (key) {
            TreatmentsService.removeTreatmentValue(key);
        });


        // Objectify the options of the treatment
        _.each(newTreatments, function (newTreatment) {
            if (typeof newTreatment.options == "string") {
                newTreatment.options = $scope.$eval("{" + newTreatment.options + "}");
            }
        });
        $scope.treatmentsSelected = newTreatments;

    }, true);

    /**
     * Used when loading the treatments values model from local storage.
     */
    $scope.$watch(function () {
        return TreatmentsService.getTreatmentsValues();
    }, function (newValue) {
        if (TreatmentsService.isLoadingTreatmentsValuesFromLocalStorage()) {
            TreatmentsService.loadingTreatmentsValuesFromLocalStorage(false);
            $scope.treatmentValues = newValue;
            // Bound corresponding models
            Object.keys($scope.treatmentValues).forEach(function (key) {
                $scope.treatmentsBoundModels[key] = treatmentValueToDescription(key, $scope.treatmentValues[key]);
            });
            return;
        }
        $scope.treatmentValues = newValue;
    }, true);

    /**
     * Adds a new treatment to the list of selected treatments,
     * by calling the Treatments service. It also associates the
     * corresponding TA asset to that treatment.
     * @param treatment The treatment to be added to the list of
     * selected treatments.
     * @ta The TA asset to associate with the treatment.
     */
    $scope.addTreatment = function (treatment, ta) {
        var treatmentCopy = _.extend({}, treatment);
        TreatmentsService.addTreatment(treatmentCopy);
        // For some reason, updating service data takes a while
        $timeout(function () {
            TreatmentsService.addTAToTreatment(treatmentCopy, ta);
            localStorageService.set('treatmentsSelected', $scope.treatmentsSelected);
        }, 100);

    };

    /**
     * Removes a treatment from the list of selected treatments,
     * by calling the Treatments service.
     * @param treatment The treatment to be removed from the list of
     * selected treatments.
     */
    $scope.removeTreatment = function (treatment) {
        TreatmentsService.removeTreatment(treatment);
    };

    /**
     * Given a treatment, returns the list of risks connected to it.
     * @param treatmentName The treatment name.
     * @returns {*}
     */
    $scope.mitigatedRisks = function (treatmentName) {
        return TreatmentsService.getRisksFromTreatment(treatmentName);
    };

    /**
     * Removes a TA asset associated to a certain treatment.
     * @param treatment The treatment.
     * @param ta The TA asset to be removed.
     */
    $scope.removeTaFromTreatment = function (treatment, ta) {
        TreatmentsService.removeTaFromTreatment(treatment, ta);
        localStorageService.set('treatmentsSelected', $scope.treatmentsSelected);
    };

    /**
     * To show or not to show the treatment options values.
     * @param treatmentName The treatment name.
     */
    $scope.toggleTreatmentValues = function (treatmentName) {
        if (TreatmentsService.showTreatmentValue(treatmentName)) {
            TreatmentsService.setShowTreatmentValue(treatmentName, true);
        } else {
            TreatmentsService.setShowTreatmentValue(treatmentName, false);
        }
    };

    /**
     * Triggered whenever some treatment option value is selected (updates the treatments
     * values accordingly by calling the Treatments service).
     * @param treatmentValueString The treatment option value selected.
     * @param treatment The treatment.
     */
    $scope.treatmentValueChanged = function (treatmentValueString, treatment) {
        var key = null;
        for (optionValue in treatment.options) {
            if (treatment.options[optionValue] == treatmentValueString) {
                key = optionValue;
                break;
            }
        }
        var update = {
            name: treatment.name,
            value: key
        };
        TreatmentsService.addTreatmentValue(update.name, update.value);
    };

    // Auxiliar function that maps a numeric treatment value to a treatment description
    var treatmentValueToDescription = function (treatmentName, treatmentValue) {
        var description = '';
        _.each($scope.treatmentsSelected, function (treatment) {
            if (treatment.name == treatmentName) {
                var treatmentOptions = $scope.$eval('{' + treatment.options + '}');
                Object.keys(treatmentOptions).forEach(function (option) {
                    if (option == treatmentValue) {
                        description = treatmentOptions[option];
                    }
                });
            }
        });
        return description;
    };

    /**
     * Function used when the treatment is added to the treatmentSelected list to pass the value to the treatment as accepted.
     * @param treatmentName
     */
    $scope.addRadioValue = function (treatmentName) {
        TreatmentsService.addTreatmentValue(treatmentName, 1);
    };

    // Initial data fetch
    ArangoDBService.getRisksTreatmentsMapping(function (error, data) {
        if (error) {
            flash.error = 'Some error occurred while fetching risks/treatments mapping values';
        } else {
            var mapping = {};
            _.each(data._documents, function (e) {
                mapping[e.risk] = e.treatments;
            });
            TreatmentsService.setRisksTreatmentsMapping(mapping);
        }
    });

    _.each($scope.taAssets, function (taAsset) {
        var cloudType = taAsset.cloudType;
        var serviceType = '';
        switch (cloudType) {
            case 'IaaS':
                serviceType = taAsset.cloudResource._serviceType;
                break;
            case 'PaaS':
                serviceType = taAsset.cloudPlatform._serviceType;
                break;
            default:
                break;
        }
        ArangoDBService.getTreatmentsConnectionsPerCloudAndServiceTypes(cloudType, serviceType, function (error, data) {
            if (error) {
                flash.error = 'Some error occurred while fetching treatments connections to services with certain cloud and service types';
            } else {
                var connections = [];
                _.each(data._documents, function (treatments) {
                    if (connections.indexOf(treatments.treatments) == -1) {
                        connections.push(treatments.treatments);
                    }
                });
                // console.log('connections', connections);
                TreatmentsService.setTreatmentsConnectedToCloudAndServiceTypes(cloudType, serviceType, connections);
            }
        });
    });

    $scope.$watch(function () {
        return AssetsService.getTA();
    }, function (newValue) {
        $scope.taAssets = newValue;
        _.each($scope.taAssets, function (taAsset) {
            var cloudType = taAsset.cloudType;
            var serviceType = '';
            switch (cloudType) {
                case 'IaaS':
                    serviceType = taAsset.cloudResource._serviceType;
                    break;
                case 'PaaS':
                    serviceType = taAsset.cloudPlatform._serviceType;
                    break;
                default:
                    break;
            }
            ArangoDBService.getTreatmentsConnectionsPerCloudAndServiceTypes(cloudType, serviceType, function (error, data) {
                if (error) {
                    flash.error = 'Some error occurred while fetching treatments connections to services with certain cloud and service types';
                } else {
                    var connections = [];
                    _.each(data._documents, function (treatments) {
                        if (connections.indexOf(treatments.treatments) == -1) {
                            connections.push(treatments.treatments);
                        }
                    });
                    TreatmentsService.setTreatmentsConnectedToCloudAndServiceTypes(cloudType, serviceType, connections);
                }
            });
        });
    }, true);

    $scope.potentialTreatmentsGroupedAndFiltered = function (cloudType, serviceType) {
        var newArray = [];
        // console.log($scope.potentialTreatmentsGrouped);
        _.each($scope.potentialTreatmentsGrouped, function (item) {
            if (_.contains(TreatmentsService.getTreatmentsConnectedToCloudAndServiceTypes(cloudType, serviceType), item.treatment.name)) {
                newArray.push(item);
            }
        });
        return newArray;
    };
}]);

