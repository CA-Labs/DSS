dssApp.controller('assetsController', function($scope, orientdbFactory) {
   // extend base controller
    //$injector.invoke(baseController, this, {$scope: $scope});

    // fetch data
    orientdbFactory.getMatching('Assets', '', function (data) {
        $scope.assets = data;
    })
});