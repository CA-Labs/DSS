/**
 * Created by Jordi Aranda.
 * 01/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('bsoiaController', ['$scope', '$localStorage', 'AssetsService', 'ArangoDBService', 'flash', function($scope, $localStorage, AssetsService, ArangoDBService, flash){

    //Initialization
    $scope.bsoiaAssets = $localStorage.bsoiaAssets = [];
    $scope.bsoiaAssetsSelected = $localStorage.bsoiaAssetsSelected = AssetsService.getBSOIA();
    $scope.bsoiaAsset = {};

    /**
     * Adds a new BSOIA asset, calling the
     * BSOIA service.
     * @param bsoiaAsset The BSOIA asset to be
     * added.
     */
    $scope.addBsoiaAsset = function(bsoiaAsset){
        AssetsService.addBSOIA(bsoiaAsset);
    };

    /**
     * Removes a BSOIA asset, calling the
     * BSOIA service.
     * @param bsoiaAsset The BSOIA asset to be
     * removed.
     */
    $scope.removeBsoiaAsset = function(bsoiaAsset){
        AssetsService.removeBSOIA(bsoiaAsset);
    };

    ArangoDBService.getBSOIA(function(error, data){
        if(error){
            flash.error = 'An error occurred while trying to fetch BSOIA assets from database';
        } else {
            $scope.bsoiaAssets = data._documents;
        }
    });

}]);
