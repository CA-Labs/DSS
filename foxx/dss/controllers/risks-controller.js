/**
 * Created by Jordi Aranda.
 * 09/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('risksController', ['$scope', 'ArangoDBService', 'flash', 'AssetsService', '$timeout', function($scope, ArangoDBService, flash, AssetsService, $timeout){

    //Initialization
    $scope.potentialRisks = [];                         //List of current potential risks depending on BSOIA/TOIA assets selected by the user
    $scope.risksSelected = AssetsService.getRisks();    //Risks selected by the user
    $scope.switch = { isSwitchSelected: true };         //Switch button to allow evaluate risks for each TA
    $scope.taAssets = AssetsService.getTA();            //The selected TA assets

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

    $scope.$watch('taAssets', function(newTaAssets){
       if(newTaAssets.length == 0){
           $scope.switch.isSwitchSelected = true;
       }
       $scope.taAssets = newTaAssets;
    });

    $scope.toggleActivation = function(){
        if(!$scope.switch.isSwitchSelected){
            if($scope.taAssets.length == 0){
                flash.warn = 'You can\'t define risks per each tangible asset since you did not specify any of them';
                $scope.switch.isSwitchSelected = true;
                return;
            } else {
                $scope.switch.isSwitchSelected = false;
            }
        }
    };

    /**
     * Adds a new risk to the list of selected risks,
     * by calling the Assets service.
     * @param risk The risk to be added to the list of
     * selected risks.
     */
    $scope.addRisk = function(risk){
        AssetsService.addRisk(risk);
    };

    /**
     * Removes a risk from the list of selected risks,
     * by calling the Assets service.
     * @param risk
     */
    $scope.removeRisk = function(risk){
        AssetsService.removeRisk(risk);
    };

}]);
