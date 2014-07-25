/**
 * Created by Jordi Aranda.
 * 02/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('toiaController', ['$scope', '$rootScope', '$localStorage', 'AssetsService', 'ArangoDBService', 'flash', function($scope, $rootScope, $localStorage, AssetsService, ArangoDBService, flash){

    //Initialization
    $scope.toiaAssets = $localStorage.toiaAssets = [];      //The TOIA assets retrieved from the DB
    $scope.toiaAssetsSelected = AssetsService.getTOIA();    //TOIA assets selected by the user (shared across the Assets service)
    $scope.bsoiaAssetsSelected = AssetsService.getBSOIA();  //BSOIA assets selected by the user (shared across the Assets service)

    /**
     * Adds a new TOIA asset to the list of selected TOIA,
     * by calling the Assets service.
     * @param toiaAsset The TOIA asset to be added.
     */
    $scope.addToiaAsset = function(toiaAsset){
        AssetsService.addTOIA(toiaAsset);
    };

    /**
     * Removes a TOIA asset from the list of selected TOIA,
     * by calling the Assets service.
     * @param toiaAssetSelected The TOIA asset to be
     * removed.
     */
    $scope.removeToiaAsset = function(toiaAssetSelected){
        AssetsService.removeTOIA(toiaAssetSelected);
    };

    /**
     * Removes the relation between a certain BSOIA asset
     * and a TOIA asset,
     * @param bsoiaAsset The BSOIA asset to be removed.
     * @param toiaAsset The TOIA asset that contains the
     * relationship between them.
     */
    $scope.removeBsoiaFromToiaAsset = function(bsoiaAsset, toiaAsset){
        AssetsService.removeBSOIAfromTOIA(bsoiaAsset.name, toiaAsset.asset.name);
    };

    /**
     * Fn called when a BSOIA asset gets dropped
     * within a selected TOIA's drop zone.
     * @param $event The event generated when dropping
     * the BSOIA asset.
     * @param $event The event raised.
     * @param $data The data passed to this fn.
     * @param toiaAsset The TOIA asset that
     * receives the event (a BSOIA asset was dropped
     * within its drop zone).
     */
    $scope.bsoiaDropped = function($event, $data, toiaAsset){
        if(AssetsService.existsBSOIAinTOIA($data.name, toiaAsset.asset.name)){
            flash.warn = 'BSOIA ' + $data.name + ' already added in TOIA ' + toiaAsset.asset.name
        } else {
            toiaAsset.bsoiaRelations.push($data);
            AssetsService.updateTOIAbyName(toiaAsset.asset.name, toiaAsset);
        }
    };

    /**
     * Fn that checks whether a certain BSOIA asset has been
     * ever selected.
     * @param bsoiaAsset The BSOIA asset to check.
     * @returns {*}
     */
    $scope.isBsoiaEverUsed = function(bsoiaAsset){
        return AssetsService.isBSOIALinked(bsoiaAsset.name);
    };

    /**
     * Listen for changes in selected TOIA
     * assets, so that potential risks can be
     * recomputed.
     */
    $scope.$watch(function(){
        return AssetsService.getTOIA();
    }, function(newVal, oldVal){
        $rootScope.$broadcast('toiaChanged');
    }, true);

    //Initial fetch of TOIA assets
    ArangoDBService.getTOIA(function(error, data){
        if(error){
            flash.error = 'An error occurred while trying to fetch BSOIA assets from database';
        } else {
            $scope.toiaAssets = data;
        }
    });

}]);