/**
 * Created by Jordi Aranda.
 * 09/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('risksController', ['$scope', 'ArangoDBService', 'flash', 'AssetsService', '$timeout', function($scope, ArangoDBService, flash, AssetsService, $timeout){

    //Initialization
    $scope.potentialRisks = [];                         //List of current potential risks depending on BSOIA/TOIA assets selected by the user
    $scope.risksSelected = AssetsService.getRisks();    //Risks selected by the user
    $scope.switch = { isSwitchSelected: false };        //Switch button to allow evaluate risks for each TA

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
     * Handles toggle event in risks switch component.
     */
    /*
    $scope.$watch('switchIsSelected', function(switchSelected){
        console.log(switchSelected);
        if(switchSelected){
            if(AssetsService.getTA().length == 0){
                //The user did not specify any TA, he can't evaluate risks per TA
                flash.warn = 'You need to specify TA before trying to evaluate risks for each of them';
                $scope.toggleActivation();
            } else {
                //TODO: Do magic here :D
            }
        } else {
            console.log('Deactivate switch');
        }
    });
    */

    $scope.toggleActivation = function(){
        $scope.switch.isSwitchSelected = !$scope.switch.isSwitchSelected;
        console.log($scope.switch.isSwitchSelected);
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
