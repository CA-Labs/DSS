/**
 * Created by Jordi Aranda.
 * 01/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('bsoiaController', ['$scope', '$localStorage', 'ArangoDBService', function($scope, $localStorage, ArangoDBService){

    //Initialization
    $scope.bsoiaAssets = $localStorage.bsoiaAssets = [];
    $scope.bsoiaAssetsSelected = $localStorage.bsoiaAssetsSelected = [];
    $scope.asset = {};

    $scope.addBsoiaAsset = function(bsoiaAsset){
        //Check asset doesn't already exists
        var exists = $scope.bsoiaAssetsSelected.filter(function(asset){
            return asset.name === bsoiaAsset.name;
        }).length > 0;
        if(!exists){
            $scope.bsoiaAssetsSelected.push(bsoiaAsset);
        }
    }

    ArangoDBService.getBSOA(function(error, data){
        if(error){
            console.log(error);
        } else {
            $scope.bsoiaAssets = data._documents;
        }
    })

}]);
