/**
 * Created by Jordi Aranda.
 * 22/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('treatmentsController'
        , ['$scope'
        , '$rootScope'
        , 'ArangoDBService'
        , 'RisksService'
        , 'AssetsService'
        , 'TreatmentsService'
        , 'flash'
        , '$timeout'
        , 'localStorageService'
    , function($scope
        , $rootScope
        , ArangoDBService
        , RisksService
        , AssetsService
        , TreatmentsService
        , flash
        , $timeout
        , localStorageService){

    $scope.taAssets = AssetsService.getTA();                                        // The list of the TA assets
    $scope.potentialTreatments = [];                                                // The list of potential treatments
    $scope.treatmentsSelected = TreatmentsService.getTreatments();                  // The list of selected treatments
    localStorageService.bind($scope, 'treatmentsSelected', $scope.treatmentsSelected);
    $scope.treatmentValues = TreatmentsService.getTreatmentsValues();               // The treatments values model
    localStorageService.bind($scope, 'treatmentValues', $scope.treatmentValues);
    $scope.risksTreatmentsMapping = TreatmentsService.getRisksTreatmentsMapping();   // Risks/treatments mapping
    localStorageService.bind($scope, 'treatmentValues', $scope.treatmentValues);

    $scope.treatmentsBoundModels = {};


    /**
     * Event received when the unaccepted risks change, so that
     * the list of potential treatments can be recomputed.
     */
    $scope.$on('risksSelectedChanged', function(){

        // Retrieve all unaccepted risks
        var unacceptableRisksPerTA = RisksService.getUnacceptableRisks();
        var unacceptableRiskNames = [];
        _.each(unacceptableRisksPerTA, function(value, key){
            _.each(value, function(riskName){
                if(unacceptableRiskNames.indexOf(riskName) == -1){
                    unacceptableRiskNames.push(riskName);
                }
            });
        });

        ArangoDBService.getPotentialTreatments(unacceptableRiskNames, function(error, data){
            if(error){
                flash.error = 'Some error occurred when trying to compute potential treatments after unacceptable risks changed';
            } else {
                var aux = [];
                _.each(data._documents, function(riskTreatments){
                    var treatments = riskTreatments.treatments;
                    _.each(treatments, function(treatment){
                        if(_.filter(aux, function(e){
                            return e.name == treatment.name;
                        }).length == 0){
                            aux.push(treatment);
                        }
                    });
                });
                $scope.potentialTreatments = aux;
                $scope.risksTreatmentsMapping = data._documents.map(function(e){ return {risk: e.risk, treatments: e.treatments.map(function(i){ return i.name })}});
            }
        });

    });

    /**
     * Every time the list of selected treatments changes, we should update the treatments
     * values model, since it doesn't change automatically and also retrieve new service proposals.
     */
    $scope.$watch(function(){
        return TreatmentsService.getTreatments();
    }, function(newTreatments, oldTreatments){

        // If we are loaading treatments from local storage, don't update treatments models
        if(TreatmentsService.isLoadingTreatmentsFromLocalStorage()){
            TreatmentsService.loadingTreatmentsFromLocalStorage(false);
            $scope.treatmentsSelected = newTreatments;
            return;
        }

        //Update treatments values model
        var keysToRemove = [];
        _.each(oldTreatments, function(oldTreatment){
            var found = false;
            _.each(newTreatments, function(newTreatment){
                if(newTreatment.name == oldTreatment.name){
                    found = true;
                };
            });
            if(!found){
                keysToRemove.push(oldTreatment.name);
            }
        });

        //Remove keys
        _.each(keysToRemove, function(key){
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

    $scope.$watch(function(){
        return TreatmentsService.getTreatmentsValues();
    }, function(newValue){
        if(TreatmentsService.isLoadingTreatmentsValuesFromLocalStorage()){
            TreatmentsService.loadingTreatmentsValuesFromLocalStorage(false);
            $scope.treatmentValues = newValue;
            // Bound corresponding models
            Object.keys($scope.treatmentValues).forEach(function(key){
                $scope.treatmentsBoundModels[key] = treatmentValueToDescription(key, $scope.treatmentValues[key]);
            });
            return;
        }
        $scope.treatmentValues = newValue;
    }, true);

    /**
     * Event received when a treatment value changes, so that treatment
     * values model can be updated.
     */
//    $scope.$on('treatmentValueChanged', function($event, update){
//        TreatmentsService.addTreatmentValue(update.name, update.value);
//    });

    /**
     * Adds a new treatment to the list of selected treatments,
     * by calling the Treatments service.
     * @param treatment The treatment to be added to the list of
     * selected treatments.
     */
    $scope.addTreatment = function(treatment){
        TreatmentsService.addTreatment(treatment);
    };

    /**
     * Removes a treatment from the list of selected treatments,
     * by calling the Treatments service.
     * @param treatment The treatment to be removed from the list of
     * selected treatments.
     */
    $scope.removeTreatment = function(treatment){
        TreatmentsService.removeTreatment(treatment);
    };

    $scope.mitigatedRisks = function(treatmentName){
        var mitigated = [];
        _.each($scope.risksTreatmentsMapping, function(riskTreatments){
            if(riskTreatments.treatments.indexOf(treatmentName) !== -1){
                mitigated.push(riskTreatments.risk);
            }
        });
        return mitigated;
    };

    $scope.taDropped = function (event, data, treatment) {
        if (TreatmentsService.taAssetExists(treatment, data)) {
            flash.warn = 'Tangible Asset [TA] already added';
        } else {
            TreatmentsService.addTAToTreatment(treatment, data);
            localStorageService.set('treatmentsSelected', $scope.treatmentsSelected);
        }

    };

    $scope.removeTaFromTreatment = function (treatment, ta) {
        TreatmentsService.removeTaFromTreatment(treatment, ta);
        localStorageService.set('treatmentsSelected', $scope.treatmentsSelected);
    };

    $scope.showTreatmentValues = false;
    localStorageService.bind($scope, 'showTreatmentValues', $scope.showTreatmentValues);

    $scope.toggleTreatmentValues = function () {
        $scope.showTreatmentValues = !$scope.showTreatmentValues;
    };

    $scope.treatmentValueChanged = function (treatmentValueString, treatment) {
        var key = null;
        for (optionValue in treatment.options) {
            if(treatment.options[optionValue] == treatmentValueString){
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
    var treatmentValueToDescription = function(treatmentName, treatmentValue){
        var description = '';
        _.each($scope.treatmentsSelected, function(treatment){
            if(treatment.name == treatmentName){
                var treatmentOptions = $scope.$eval('{' + treatment.options + '}');
                Object.keys(treatmentOptions).forEach(function(option){
                    if(option == treatmentValue){
                        description = treatmentOptions[option];
                    }
                });
            }
        });
        return description;
    }

    /**
     * Function used when the treatment is added to the treatmentSelected list to pass the value to the treatment as acepted.
     * @param treatmentName
     */
    $scope.addRadioValue = function (treatmentName) {
        TreatmentsService.addTreatmentValue(treatmentName, 1);
    };

}]);
