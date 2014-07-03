/**
 * Created by Jordi Aranda.
 * 02/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('toiaController', ['$rootScope', '$scope', '$localStorage', 'AssetsService', 'ArangoDBService', 'flash', function($rootScope, $scope, $localStorage, AssetsService, ArangoDBService, flash){

    //Initialization
    $scope.toiaAssets = $localStorage.toiaAssets = [];
    $scope.toiaAssetsSelected = AssetsService.getTOIA();
    $scope.bsoiaAssetsSelected = AssetsService.getBSOIA();

    $scope.addToiaAsset = function(toiaAsset){
        AssetsService.addTOIA(toiaAsset);
    };

    $scope.removeToiaAsset = function(toiaAssetSelected){
        AssetsService.removeTOIA(toiaAssetSelected);
    };

    $scope.bsoiaDropped = function($event, $data, toiaAsset){
        if(AssetsService.existsBSOIAinTOIA($data.name, toiaAsset.asset.name)){
            flash.warn = 'BSOIA ' + $data.name + ' already added in ' + toiaAsset.asset.name
        } else {
            toiaAsset.bsoiaRelations.push($data);
            AssetsService.updateTOIAbyName(toiaAsset.asset.name, toiaAsset);
        }
    };

    ArangoDBService.getTOIA(function(error, data){
        if(error){
            flash.error = 'An error occurred while trying to fetch BSOIA assets from database';
        } else {
            $scope.toiaAssets = data._documents;
        }
    });

}]);