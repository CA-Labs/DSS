/**
 * Created by Jordi Aranda.
 * 07/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('taController', ['$scope', 'AssetsService', 'localStorageService', function($scope, AssetsService, localStorageService){

    //Initialization
    $scope.taAssets = AssetsService.getTA();                        //The list of TA assets read from the cloud services descriptor xml file
    localStorageService.bind($scope, 'taAssets', $scope.taAssets);  // Bind the taAssets to localStorage
    // Kind of a hack: this is necessary when loading BSOIA assets from local storage,
    // since the reference seems to be lost when setting the new BSOIA assets in the service
    // variable.
    $scope.$watch(function(){
        return AssetsService.getTA();
    }, function(newTA){
        $scope.taAssets = newTA;
    }, true);


    /**
     * Removes a TA asset from the list of assets selected
     * by the user, by calling the Assets service.
     * @param taAsset The TA asset to be removed.
     */
    $scope.removeTaAsset = function(taAsset){
        AssetsService.removeTA(taAsset);
    };

}]);