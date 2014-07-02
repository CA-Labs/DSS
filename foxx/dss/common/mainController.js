dssApp.controller('mainController', ['$scope', '$rootScope', '$localStorage', function ($scope, $rootScope, $localStorage) {

    $scope.clearSelection = function () {
        $localStorage.bsoiaAssetsSelected = $rootScope.bsoiaAssetsSelected = [];
        $localStorage.toiaAssetsSelected = $rootScope.toiaAssetsSelected = [];
        $localStorage.risksSelected = $rootScope.risksSelected = [];
        $localStorage.treatmentsSelected = $rootScope.treatmentsSelected = [];
        // TODO: extend with cloud services selected
    };

    $scope.saveSessionFile = function (event) {
        var element = angular.element(event.target);

        element.attr({
            download: 'DSS_Session.json',
            href: 'data:application/json;charset=utf-8,' + encodeURI(JSON.stringify($localStorage)),
            target: '_blank'
        });
    };

    $scope.uploadSessionFile = function () {
        $('#uploadSessionFile').trigger('click');
    };

    $scope.loadLocalSessionContent = function ($fileContent) {
        if (dssApp.isJSON($fileContent)) {
            var fileContent = JSON.parse($fileContent);
            $localStorage.assetsSelected = $rootScope.assetsSelected = fileContent.assetsSelected;
            $localStorage.risksSelected = $rootScope.risksSelected = fileContent.risksSelected;
            $localStorage.requirementsSelected = $rootScope.requirementsSelected = fileContent.requirementsSelected;
            // TODO: extend with cloud services selected
        }
    }
}]);