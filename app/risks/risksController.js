dssApp.controller('risksController', function ($scope, orientdbFactory) {

    // init
    $scope.risk = "";
    $scope.risksSelected = [];

    // fetch data
    orientdbFactory.getMatching('risks', '', function (data) {
       $scope.risks = data;
    });
});