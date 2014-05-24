dssApp.controller('requirementsController', function($scope, $rootScope, orientdbFactory, $localStorage) {
    $rootScope.requirementsSelected = $localStorage.requirementsSelected || [];
    $scope.requirement = "";

    // fetch data
//    orientdbFactory.getMatching('requirements', '', function (data) {
//        $scope.requirements = data;
//    });

    $scope.$watch('requirementsSelected', function (value) {
       $localStorage.requirementsSelected = value;
    });
//    $scope.queryElements = [];
//    $scope.selectedServices = [];
//    $scope.selectedServicesEdges = [];
//    $scope.requirements = dataFactory.getAllRequirements();
//    $scope.showSubcategory = function(categoryName) {
//        $(document).foundation();
//        $('.thirdLevelRequirements').hide();
//        return $('#' + categoryName).fadeIn();
//    };
//    $scope.closeSubcategory = function(className) {
//        return $("." + className).fadeOut();
//    };
//    $scope.addElementToQuery = function(categoryName) {
//        var requirementName;
//        requirementName = $("select." + categoryName).val();
//        return angular.forEach($scope.requirements, function(requirement) {
//            if (requirement.category === categoryName
//                && requirement.name === requirementName
//                && $scope.queryElements.indexOf(requirement) === -1) {
//                return $scope.queryElements.push(requirement);
//            }
//        });
//    };
//    $scope.change = function() {
//        var queryString;
//        queryString = "select from Services where 1=1";
//        $(".query").each(function() {
//            var element, elementInputs, elementName, elementType, elementValue, queryElement;
//            element = $(this);
//            elementType = element.get(0).tagName;
//            elementName = element.attr("name");
//            switch (elementType) {
//                case 'SELECT':
//                    elementValue = element.val();
//                    if (elementValue !== "none") {
//                        queryElement = " AND " + elementName + " = " + elementValue + "";
//                        return queryString = queryString + queryElement;
//                    }
//                    break;
//                case 'INPUT':
//                    elementValue = element.val();
//                    if (elementValue) {
//                        queryElement = " AND " + elementName + " = '" + elementValue + "'";
//                        return queryString = queryString + queryElement;
//                    }
//                    break;
//                case 'DIV':
//                    if (element.hasClass('noUiSlider')) {
//                        return console.log("slider");
//                    } else if (element.hasClass('switch')) {
//                        elementInputs = element.find("input");
//                        return elementInputs.each(function() {
//                            var elementInput;
//                            elementInput = $(this);
//                            if (elementInput.is(":checked")) {
//                                elementValue = elementInput.attr("id");
//                                queryElement = " AND " + elementName + " = " + elementValue;
//                                return queryString = queryString + queryElement;
//                            }
//                        });
//                    }
//                    break;
//                default:
//                    return console.log(elementType);
//                    break;
//            }
//        });
//        if (queryString.search("AND") !== -1) {
//            $scope.matchingServices = dataFactory.catchMatching(queryString);
//        }
//        console.log(queryString);
//        console.log($scope.matchingServices);
//        return $scope.selected = function(serviceBoxId) {
//            var serviceBox, serviceObject;
//            serviceBox = $("#service-" + serviceBoxId);
//            serviceObject = $(this);
//            serviceBox.toggleClass("selected");
//            $scope.selectedServices.push(serviceObject);
//            return console.log($scope.selectedServices);
//        };
//    };
//    return $scope.$watch('selectedServices', function() {
//        var queryEdges = "select from Services where 1=1";
//        angular.forEach($scope.selectedServices, function(selectedService) {});
//        console.log($scope.selectedServices);
//        if ($scope.selectedServices.length) {
//            return $scope.selectedServicesEdges = dataFactory.matchingServices(queryEdges);
//        }
    });
