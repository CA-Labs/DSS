/**
 * Created by Jordi Aranda.
 * 02/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('toiaController', ['$scope', '$localStorage', 'ArangoDBService', 'flash', function($scope, $localStorage, ArangoDBService, flash){

    //Initialization
    $scope.toiaAssets = $localStorage.toiaAssets = [];
    $scope.toiaAssetsSelected = $localStorage.toiaAssetsSelected = [];
    $scope.toiaAsset = {};

    $scope.addToiaAsset = function(toiaAsset){
        //Check asset doesn't already exists
        var exists = $scope.toiaAssetsSelected.filter(function(asset){
            return asset.name === toiaAsset.name;
        }).length > 0;
        if(!exists){
            $scope.toiaAssetsSelected.push(toiaAsset);
        } else {
            flash.warn = 'This asset has been already added!';
        }
    };

    $scope.removeToiaAsset = function(toiaAssetSelected){
        var index = -1;
        _.each($scope.toiaAssetsSelected, function(asset, assetIndex){
            if(asset.name == toiaAssetSelected.name){
                index = assetIndex;
            }
        });
        if(index >= 0) $scope.toiaAssetsSelected.splice(index, 1);
    };

    ArangoDBService.getTOIA(function(error, data){
        if(error){
            flash.error = 'An error occurred while trying to fetch BSOIA assets from database';
        } else {
            $scope.toiaAssets = data._documents;
        }
    });

}]);