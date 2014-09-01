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

    $scope.taAssets = AssetsService.getTA();                                // The list of the TA assets
    $scope.potentialTreatments = [];                                        // The list of potential treatments
    $scope.treatmentsSelected = TreatmentsService.getTreatments();          // The list of selected treatments
    localStorageService.bind($scope, 'treatmentsSelected', $scope.treatmentsSelected);
    $scope.treatmentValues = TreatmentsService.getTreatmentsValues();       // The treatments values model
    localStorageService.bind($scope, 'treatmentValues', $scope.treatmentValues);

    /**
     * Event received when the list of selected risks changes, so that
     * the list of potential treatments can be recomputed.
     */
    $scope.$on('risksSelectedChanged', function(){
        // Only update if we have at least one risk selected
        if(RisksService.getRisks().length > 0){
            ArangoDBService.getPotentialTreatments(function(error, data){
                if(error){
                    flash.error = 'Some error occurred when trying to compute potential treatments after selected risks changed';
                } else {
                    var seen = [];
                    var aux = [];
                    _.each(data._documents, function(treatment){
                        //TODO: Move this logic to an Angular filter
                        //Filter repeated treatments by hand since AngularJS filter "unique" does not seem to work properly
                        if(seen.indexOf(treatment.destination.name) === -1){
                            seen.push(treatment.destination.name);
                            aux.push(treatment);
                        }
                    });
                    $scope.potentialTreatments = aux;
                }
            });
        }
    });

    /**
     * Every time the list of selected treatments changes, we should update the treatments
     * values model, since it doesn't change automatically.
     */
    $scope.$watch(function(){
        return $scope.treatmentsSelected;
    }, function(newTreatments, oldTreatments){

        //Update treatments values model
        var keysToRemove = [];
        _.each(oldTreatments, function(oldTreatment){
            var found = false;
            _.each(newTreatments, function(newTreatment){
                if(newTreatment.destination.name == oldTreatment.destination.name){
                    found = true;
                };
            });
            if(!found){
                keysToRemove.push(oldTreatment.destination.name);
            }
        });

        //Remove keys
        _.each(keysToRemove, function(key){
            TreatmentsService.removeTreatmentValue(key);
        });


        // Objectify the options of the treatment
        _.each(newTreatments, function (newTreatment) {
            if (typeof newTreatment.destination.options == "string") {
                newTreatment.destination.options = $scope.$eval("{" + newTreatment.destination.options + "}");
            }
        });
        $scope.treatmentsSelected = newTreatments;

    }, true);

    $scope.$watch(function(){
        return $scope.treatmentValues;
    }, function(newValue, oldValue){
        //TODO:
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
    }

    $scope.showTreatmentValues = false;

    $scope.toggleTreatmentValues = function () {
        $scope.showTreatmentValues = !$scope.showTreatmentValues;
    };

    $scope.treatmentValueChanged = function (treatmentValueString, treatment) {
        var key = null;
        for (optionValue in treatment.destination.options) {
            if(treatment.destination.options[optionValue] == treatmentValueString){
                key = optionValue;
                break;
            }
        }
        var update = {
            name: treatment.destination.name,
            value: key
        };
        TreatmentsService.addTreatmentValue(update.name, update.value);
    };
}]);
