/**
 * Created by Jordi Aranda.
 * 07/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('taController', ['$scope', 'AssetsService', function($scope, AssetsService){

    //Initialization
    $scope.taAssets = AssetsService.getTAReadFromXML();         //The list of TA assets read from the cloud services descriptor xml file
    $scope.taAssetsSelected = AssetsService.getTA();            //The list of TA assets selected by the user (shared across the Assets service)

    /**
     * Adds a TA asset to the list
     * of assets selected by the
     * user.
     * @param taAsset The TA asset to be
     * added.
     */
    $scope.addTaAsset = function(taAsset){
        AssetsService.addTA(taAsset);
    };

    /**
     * Removes a TA asset from the
     * list of assets selected by the
     * user.
     * @param taAsset The TA asset to
     * be removed.
     */
    $scope.removeTaAsset = function(taAsset){
        AssetsService.removeTA(taAsset);
    };

}]);
