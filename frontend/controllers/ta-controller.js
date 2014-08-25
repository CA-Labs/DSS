/**
 * Created by Jordi Aranda.
 * 07/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('taController', ['$scope', 'AssetsService', '$localStorage', function($scope, AssetsService, $localStorage){

    //Initialization
    $scope.taAssets = AssetsService.getTA();                     //The list of TA assets read from the cloud services descriptor xml file

    /**
     * Removes a TA asset from the list of assets selected
     * by the user, by calling the Assets service.
     * @param taAsset The TA asset to be removed.
     */
    $scope.removeTaAsset = function(taAsset){
        AssetsService.removeTA(taAsset);
    };

}]);