/**
 * Created by Jordi Aranda.
 * 18/08/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('cloudController', ['$scope', 'ArangoDBService', 'TreatmentsService', function($scope, ArangoDBService, TreatmentsService){

    $scope.treatments = TreatmentsService.getTreatments();              // The selected TA assets loaded from the cloud descriptor xml file
    $scope.proposals = [];                                              // The cloud service proposals offered by the graph engine

    $scope.$watch(function(){
        return $scope.treatments
    }, function(newTreatments, oldTreatments){
        $scope.treatments = newTreatments;
        $scope.proposals = ArangoDBService.getProposals('IaaS', $scope.treatments);
    }, true);

}]);
