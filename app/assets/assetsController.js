dssApp.controller('assetsController', function($scope, orientdbFactory) {
   // extend base controller
    //$injector.invoke(baseController, this, {$scope: $scope});

    $scope.asset = "";
    $scope.assetsSelected = [];
    $scope.description = "";
    $scope.updateDescription = function (assetSelected) {
        $scope.asset.description = assetSelected.description;
    };

    // fetch data
    orientdbFactory.getMatching('Assets', '', function (data) {
        $scope.assets = data;
    });
});