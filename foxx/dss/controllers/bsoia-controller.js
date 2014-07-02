/**
 * Created by Jordi Aranda.
 * 01/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('bsoiaController', ['$scope', '$localStorage', 'ArangoDBService', 'flash', function($scope, $localStorage, ArangoDBService, flash){

    //Initialization
    $scope.bsoiaAssets = $localStorage.bsoiaAssets = [];
    $scope.bsoiaAssetsSelected = $localStorage.bsoiaAssetsSelected = [];
    $scope.bsoiaAsset = {};

    /**
     * Adds an asset to the list of selected
     * BSOIA assets.
     * @param bsoiaAsset The selected asset to add.
     */
    $scope.addBsoiaAsset = function(bsoiaAsset){
        //Check asset doesn't already exists
        var exists = $scope.bsoiaAssetsSelected.filter(function(asset){
            return asset.name === bsoiaAsset.name;
        }).length > 0;
        if(!exists){
            $scope.bsoiaAssetsSelected.push(bsoiaAsset);
        } else {
            flash.warn = 'This asset has been already added!';
        }
    };

    /**
     * Removes an asset from the list of
     * selected BSOIA assets.
     * @param bsoiaAsset The asset to be removed.
     */
    $scope.removeBsoiaAsset = function(bsoiaAssetSelected){
        var index = -1;
        _.each($scope.bsoiaAssetsSelected, function(asset, assetIndex){
            if(asset.name == bsoiaAssetSelected.name){
                index = assetIndex;
            }
        });
        if(index >= 0) $scope.bsoiaAssetsSelected.splice(index, 1);
    };

    ArangoDBService.getBSOA(function(error, data){
        if(error){
            flash.error = 'An error occurred while trying to fetch BSOIA assets from database';
        } else {
            $scope.bsoiaAssets = data._documents;
        }
    })

}]);
