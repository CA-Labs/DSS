dssApp.controller('risksController', function ($scope, $rootScope, orientdbFactory, $localStorage) {

    // init
    $scope.risk = "";
    $rootScope.risksSelected = $localStorage.risksSelected || [];

    // fetch data
//    orientdbFactory.getMatching('risks', '', function (data) {
//       $rootScope.risks = data;
//    });

    $scope.$watch('risksSelected', function (value) {
        $localStorage.risksSelected = value;
    }, true);
});