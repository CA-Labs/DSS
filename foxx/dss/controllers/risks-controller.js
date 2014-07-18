/**
 * Created by Jordi Aranda.
 * 09/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('risksController', ['$scope', 'ArangoDBService', 'flash', 'AssetsService', 'RisksService', '$timeout', '$interpolate', function($scope, ArangoDBService, flash, AssetsService, RisksService, $timeout, $interpolate){

    //Initialization
    $scope.potentialRisks = [];                                                                     //List of current potential risks depending on BSOIA/TOIA assets selected by the user
    $scope.risksSelected = RisksService.getRisks();                                                 //Risks selected by the user
    $scope.multiple = false;                                                                        //Switch button to allow evaluate risks for each TA
    $scope.taAssets = AssetsService.getTA();                                                        //The selected TA assets
    $scope.simpleRisksLikelihoodConsequence = RisksService.getRisksLikelihoodConsequence();         //Likelihood/Consequence values for simple risks model
    $scope.multipleRisksLikelihoodConsequence = RisksService.getRisksTALikelihoodConsequence();     //Likelihood/Consequence values for multiple risks model

    /**
     * Event received when a BSOIA asset has been selected/removed
     * by the user. This allows to recompute the potential risks.
     */
    $scope.$on('bsoiaChanged', function(){
        ArangoDBService.getPotentialRisks(function(error, data){
            if(error){
                flash.error = 'Some error occurred when trying to compute potential risks after selected BSOIA changed';
            } else {
                var seen = [];
                var aux = [];
                _.each(data._documents, function(risk){
                    //TODO: Move this logic to an Angular filter
                    //Filter repeated risks by hand since AngularJS filter "unique" does not seem to work properly
                    if(seen.indexOf(risk.destination.name) === -1){
                        seen.push(risk.destination.name);
                        aux.push(risk);
                    }
                });
                $scope.potentialRisks = aux;
            }
        });
    });

    /**
     * Event received when a TOIA asset has been selected/removed
     * by the user. This allows to recompute the potential risks.
     */
    $scope.$on('toiaChanged', function(){
        ArangoDBService.getPotentialRisks(function(error, data){
           if(error){
               flash.error = 'Some error occurred when trying to compute potential risks after selected TOIA changed';
           } else {
               var seen = [];
               var aux = [];
               _.each(data._documents, function(risk){
                   //TODO: Move this logic to an Angular filter
                   //Filter repeated risks by hand since AngularJS filter "unique" does not seem to work properly
                   if(seen.indexOf(risk.destination.name) === -1){
                       seen.push(risk.destination.name);
                       aux.push(risk);
                   }
               });
               $scope.potentialRisks = aux;
           }
        });
    });

    /**
     * Handles toggle event in risks switch component and manages
     * the logic of when the user can specify risks per each tangible
     * asset.
     */

    $scope.$watch('taAssets', function(newTaAssets, oldTaAssets){

        //Check switch button status
        if(newTaAssets.length == 0){
            $scope.multiple = false;
        }

        //TODO: Update Risks service models, if required (taAssets might have been added/deleted)
        $scope.taAssets = newTaAssets;
    });

    $scope.$watch('risksSelected', function(newRisks, oldRisks){
        //TODO: Update Risks service models, if required (risks might have been added/deleted)
    });

    $scope.toggleActivation = function(){
        if($scope.multiple){
            if($scope.taAssets.length == 0){
                flash.warn = 'You can\'t define risks per each tangible asset since you did not specify any of them';
                $scope.multiple = false;
                return;
            } else {
                $scope.multiple = true;
            }
        }
    };

    /**
     * Adds a new risk to the list of selected risks,
     * by calling the Risks service.
     * @param risk The risk to be added to the list of
     * selected risks.
     */
    $scope.addRisk = function(risk){
        RisksService.addRisk(risk);
    };

    /**
     * Removes a risk from the list of selected risks,
     * by calling the Risks service.
     * @param risk
     */
    $scope.removeRisk = function(risk){
        RisksService.removeRisk(risk);
    };

    /**
     * Event received when a certain slider value has changed.
     * It updates the corresponding model in the Risks service
     * so that we can track all risk lihelihood/consequence slider
     * values.
     */
    $scope.$on('sliderValueChanged', function($event, element){

        //Current slider value
        var sliderValue = element.value;

        //Retrieve the unique hash key to know what must be updated in risks services, wheter simple or multiple models
        var hashKey = element.slider.data('hash-key');
        var hashAttributes = hashKey.split('_');

        if(hashAttributes.length < 2){
            flash.error = 'Incorrect hash key for slider value!';
            return;
        }

        var riskName = hashAttributes[0];

        if($scope.multiple){
            //Look up what TA asset we are referring to
            var taKey = hashAttributes[1];
            //Likelihood or consequence?
            var valueToUpdate = hashAttributes[2];
            if(valueToUpdate == "likelihood"){
                //Update likelihood for a certain TA in multiple model
                RisksService.addRiskTALikelihood(riskName, taKey, sliderValue);
            } else {
                //Update consequence for a certain TA in multiple model
                RisksService.addRiskTAConsequence(riskName, taKey, sliderValue);
            }
        } else {
            //Likelihood or consequence?
            var valueToUpdate = hashAttributes[1];
            if(valueToUpdate == "likelihood"){
                //Update likelihood in simple model
                RisksService.addRiskLikelihood(riskName, sliderValue)
            } else {
                //Update consequence in simple model
                RisksService.addRiskConsequence(riskName, sliderValue);
            }
        }
        console.log($scope.simpleRisksLikelihoodConsequence);
        console.log($scope.multipleRisksLikelihoodConsequence);
    });

}]);
