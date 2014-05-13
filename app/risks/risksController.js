dssApp.controller('risksController', function ($scope, orientdbFactory, $localStorage) {

    // init
    $scope.risk = "";
    $scope.risksSelected = $localStorage.risksSelected || [];

    // fetch data
    orientdbFactory.getMatching('risks', '', function (data) {
       $scope.risks = data;
    });

    $scope.$watch('risksSelected', function (value) {
        $localStorage.risksSelected = value;
    });
});