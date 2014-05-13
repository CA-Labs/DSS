dssApp.controller('mainController', function ($scope, $rootScope, orientdbFactory, $localStorage) {

    $scope.clearSelection = function () {
        $localStorage.assetsSelected = $rootScope.assetsSelected = [];
        $localStorage.risksSelected = $rootScope.risksSelected = [];
        $localStorage.requirementsSelected = $rootScope.requirementsSelected = [];
    };

    $scope.saveSession = function (event) {
        var element = angular.element(event.target);

        element.attr({
            download: 'DSS_Session.json',
            href: 'data:application/json;charset=utf-8,' + encodeURI(JSON.stringify($localStorage)),
            target: '_blank'
        });
    };
});