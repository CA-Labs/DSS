/**
 * Created by Jordi Aranda.
 * 01/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('bsoiaController', ['$scope', '$rootScope', 'localStorageService', 'AssetsService', 'ArangoDBService', 'flash', function($scope, $rootScope, localStorageService ,AssetsService, ArangoDBService, flash){

    //Initialization
    $scope.bsoiaAssets = [];                                            //BSOIA assets retrieved from the DB
    $scope.bsoiaAssetsSelected = AssetsService.getBSOIA();              //BSOIA assets selected by the user (shared across the Assets service)
    localStorageService.bind($scope, 'bsoiaAssetsSelected', $scope.bsoiaAssetsSelected);

    // Kind of a hack: this is necessary when loading BSOIA assets from local storage,
    // since the reference seems to be lost when setting the new BSOIA assets in the service
    // variable.
    $scope.$watch(function(){
        return AssetsService.getBSOIA();
    }, function(newBSOIA){
        $scope.bsoiaAssetsSelected = newBSOIA;
    }, true);

    /**
     * Adds a new BSOIA asset, calling the
     * Assets service.
     * @param bsoiaAsset The BSOIA asset to be
     * added.
     */
    $scope.addBsoiaAsset = function(bsoiaAsset){
        AssetsService.addBSOIA(bsoiaAsset);
    };

    /**
     * Removes a BSOIA asset, calling the
     * Assets service.
     * @param bsoiaAsset The BSOIA asset to be
     * removed.
     */
    $scope.removeBsoiaAsset = function(bsoiaAsset){
        AssetsService.removeBSOIA(bsoiaAsset);
    };

    /**
     * Listen for changes in selected BSOIA
     * assets, so that potential risks can be
     * recomputed.
     */
    $scope.$watch(function(){
        return AssetsService.getBSOIA();
    }, function(newVal, oldVal){
        $rootScope.$broadcast('bsoiaChanged');
    }, true);

    //Initial fetch of BSOIA assets
    ArangoDBService.getBSOIA(function(error, data){
        if(error){
            flash.error = 'An error occurred while trying to fetch BSOIA assets from database';
        } else {
            $scope.bsoiaAssets = data;
        }
    });

}]);
