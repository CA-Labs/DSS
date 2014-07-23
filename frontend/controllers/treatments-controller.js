/**
 * Created by Jordi Aranda.
 * 22/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('treatmentsController', ['$scope', 'ArangoDBService', 'TreatmentsService', 'flash', function($scope, ArangoDBService, TreatmentsService, flash){

    $scope.potentialTreatments = [];                                        // The list of potential treatments
    $scope.treatmentsSelected = TreatmentsService.getTreatments();          // The list of selected treatments
    $scope.treatmentValues = TreatmentsService.getTreatmentsValues();       // The treatments values model

    /**
     * Event received when the list of selected risks changes, so that
     * the list of potential treatments can be recomputed.
     */
    $scope.$on('risksSelectedChanged', function(){
        ArangoDBService.getPotentialTreatments(function(error, data){
            if(error){
                flash.error = 'Some error occurred whehn trying to compute potential treatments after selected risks changed';
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
        })
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

        $scope.treatmentsSelected = newTreatments;

    }, true);

    $scope.$watch(function(){
        return $scope.treatmentValues;
    }, function(newValue, oldValue){
        console.log('old', oldValue);
        console.log('new', newValue);
    }, true);

    /**
     * Event received when a treatment value changes, so that treatment
     * values model can be updated.
     */
    $scope.$on('treatmentValueChanged', function($event, update){
        TreatmentsService.addTreatmentValue(update.name, update.value);
    });

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

}]);
