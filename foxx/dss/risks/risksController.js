dssApp.controller('risksController', ["$scope", "$rootScope", "$localStorage", function ($scope, $rootScope, $localStorage) {

    // init
    $scope.risk = "";
    $rootScope.risksSelected = $localStorage.risksSelected || [];

    // fetch data
//    orientdbFactory.getMatching('risks', '', function (data) {
//       $rootScope.risks = data;
//    });

/**
    $scope.$watch('risksSelected', function (value) {
        $localStorage.risksSelected = value;
        var risksNames = helper.selectAttributeFromObjects(value, 'name');
        var risksConditions = [];
        // TODO: refactor
        angular.forEach(risksNames, function (value) {
            risksConditions.push({
                "attribute": "name",
                "operator": "=",
                "value": value
            });
        });

        var query = {
            columns: "expand(out())",
            conditions: { "WHEREOR": risksConditions }
        };

        /*
        orientdbFactory.getMatching('Risks', query, function (data) {
            $rootScope.requirements = data;
        })
    }, true);
*/
}]);