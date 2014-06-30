dssApp.controller('assetsController', ["$scope", "$rootScope", "ArangoDBService", "$localStorage", function($scope, $rootScope, ArangoDBService, $localStorage) {
   // extend base controller
    //$injector.invoke(baseController, this, {$scope: $scope});

    // inits
    $scope.asset = "";
    $rootScope.assetsSelected = $localStorage.assetsSelected || [];
    $scope.description = "";

    /**
     * Simple update description on the asset selection view
     * @param assetSelected
     */
    $scope.updateDescription = function (assetSelected) {
        $scope.asset.description = assetSelected.description;
    };

    /**
     * Watch assetsSelected $scope and save the selected values to $localStorage if needed as well as rerun
     * risks identified query to only show the risks which are based on the selected assets.
     */
    /**
    $scope.$watch("assetsSelected", function (value) {
        $localStorage.assetsSelected = value;
        var assetNames = helper.selectAttributeFromObjects(value, 'name');
        var assetConditions = [];
        // TODO: refactor
        angular.forEach(assetNames, function (value) {
            assetConditions.push({
                    "attribute": "name",
                    "operator": "=",
                    "value": value
            });
        });
        var query = {
            columns: "expand(both())",
            conditions: { "WHEREOR": assetConditions }
        };

        // Selects only risks which are connected to the assets selected, hence query on assets
        orientdbFactory.getMatching('Assets', query, function (data) {
            $rootScope.risks = data;
        });
    }, true);
    */

    /**
     * Initial fetch of the data using back end. it will set the local scope in this case. Only risks and
     * requirements need to have the shared data set via $rootScope as those are the only ones reset from not
     * local controller.
     */
    /*
    orientdbFactory.getMatching('Assets', '', function (data) {
        $scope.assets = data;
    });
    */
    
    ArangoDBService.getBSOA(function(error, data){
      if(error){
        console.log(error);
      } else {
        console.log(data);
        $scope.assets = data;
      }
    });
    
}]);