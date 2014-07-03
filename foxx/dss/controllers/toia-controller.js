/**
 * Created by Jordi Aranda.
 * 02/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('toiaController', ['$rootScope', '$scope', '$localStorage', 'AssetsService', 'ArangoDBService', 'flash', function($rootScope, $scope, $localStorage, AssetsService, ArangoDBService, flash){

    //Initialization
    $scope.toiaAssets = $localStorage.toiaAssets = [];      //The TOIA assets retrieved from the DB
    $scope.toiaAssetsSelected = AssetsService.getTOIA();    //TOIA assets selected by the user (shared across the Assets service)
    $scope.bsoiaAssetsSelected = AssetsService.getBSOIA();  //BSOIA assets selected by the user (shared across the Assets service)

    /**
     * Adds a new TOIA asset, calling the
     * Assets service.
     * @param toiaAsset The TOIA asset to be added.
     */
    $scope.addToiaAsset = function(toiaAsset){
        AssetsService.addTOIA(toiaAsset);
    };

    /**
     * Removes a TOIA asset, calling the
     * Assets service.
     * @param toiaAssetSelected The TOIA asset to be
     * removed.
     */
    $scope.removeToiaAsset = function(toiaAssetSelected){
        AssetsService.removeTOIA(toiaAssetSelected);
    };

    /**
     * Fn called when a BSOIA asset gets dropped
     * within a selected TOIA's drop zone.
     * @param $event The event generated when dropping
     * the BSOIA asset.
     * @param $data The data passed to this fn.
     * @param toiaAsset The TOIA asset that
     * receives the event (a BSOIA asset was dropped
     * within its drop zone).
     */
    $scope.bsoiaDropped = function($event, $data, toiaAsset){
        if(AssetsService.existsBSOIAinTOIA($data.name, toiaAsset.asset.name)){
            flash.warn = 'BSOIA ' + $data.name + ' already added in ' + toiaAsset.asset.name
        } else {
            toiaAsset.bsoiaRelations.push($data);
            AssetsService.updateTOIAbyName(toiaAsset.asset.name, toiaAsset);
        }
    };

    //Initial fetch of TOIA assets
    ArangoDBService.getTOIA(function(error, data){
        if(error){
            flash.error = 'An error occurred while trying to fetch BSOIA assets from database';
        } else {
            $scope.toiaAssets = data._documents;
        }
    });

}]);