/**
 * Created by Jordi Aranda.
 * 18/08/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('cloudController', ['$scope', 'ArangoDBService', function($scope, ArangoDBService){

    $scope.proposals = ArangoDBService.getProposals();

}]);
