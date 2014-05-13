dssApp.controller('mainController', function ($scope, $rootScope, orientdbFactory, $localStorage) {

    $scope.clearSelection = function () {
        $localStorage.assetsSelected = $rootScope.assetsSelected = [];
        $localStorage.risksSelected = $rootScope.risksSelected = [];
        $localStorage.requirementsSelected = $rootScope.requirementsSelected = [];
    };
});