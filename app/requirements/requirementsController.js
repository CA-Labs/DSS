dssApp.controller('requirementsController', function($scope) {
    $scope.requirements = [{"@type":"d","@rid":"#14:0","@version":1,"@class":"Requirements","name":"accountability","level":1,"definition":"This category contains attributes used to measure the properties related to the cloud service provider organization. These properties may be independent of the service being provided.","linkName":"accountability","type":"slider","attributes":"range: [0, 10], step: 1"},{"@type":"d","@rid":"#14:1","@version":1,"@class":"Requirements","name":"agility","level":1,"definition":"Indicates the impact of a service upon a client’s ability to change direction, strategy, or tactics quickly and with minimal disruption.","linkName":"agility","type":"slider","attributes":"range: [0, 10], step: 1, start: 0"},{"@type":"d","@rid":"#14:2","@version":1,"@class":"Requirements","name":"assurance","level":1,"definition":"This category includes key attributes that indicate how likely it is that the service will be available as specified.","linkName":"assurance","type":"slider","attributes":"range: [0, 10], step: 1, start: 0"},{"@type":"d","@rid":"#14:3","@version":1,"@class":"Requirements","name":"financial","level":1,"definition":"The amount of money spent on the service by the client.","linkName":"financial","type":"slider","attributes":"range: [0,10], step: 1, start: 0"},{"@type":"d","@rid":"#14:4","@version":3,"@class":"Requirements","name":"performance","level":1,"definition":"This category covers the features and functions of the provided services.","linkName":"performance","type":"slider","attributes":"range: [0,10], step: 1, start: 0"},{"@type":"d","@rid":"#14:5","@version":1,"@class":"Requirements","name":"security and Privacy","level":1,"definition":"This category includes attributes that indicate the effectiveness of a cloud service provider’s controls on access to services, service data, and the physical facilities from which services are provided.","linkname":"securityandprivacy","type":"slider","attributes":"range: [0,10], step: 1"},{"@type":"d","@rid":"#14:6","@version":2,"@class":"Requirements","name":"usability","level":1,"definition":"The ease with which a service can be used.","linkName":"usability","type":"slider","attributes":"range: [0,10], step: 1, start: 0"},{"@type":"d","@rid":"#14:7","@version":0,"@class":"Requirements","name":"monitoring service","level":3,"definition":"Description Missing","linkName":"accountability_auditability_monitoringService","type":"select","attributes":"0:'none', 5:'basic', 10:'freely configurable monitoring system'","category":"accountability","subcategory":"auditability"},{"@type":"d","@rid":"#14:8","@version":0,"@class":"Requirements","name":"data location","level":3,"definition":"Description Missing","linkName":"accountability_compliance_dataLocation","type":"select","attributes":"0:\"unknown\", 3:\"outside Europe/USA\", 6:\"USA\", 10:\"Europe\"","category":"accountability","subcategory":"compliance"},{"@type":"d","@rid":"#14:9","@version":0,"@class":"Requirements","name":"place of jurisdiction","level":3,"definition":"Description Missing","linkName":"accountability_compliance_placeOfJurisdiction","type":"select","attributes":"3:\"outside Europe/USA\", 6:\"USA\", 10:\"Europe\"","category":"accountability","subcategory":"compliance"},{"@type":"d","@rid":"#14:10","@version":1,"@class":"Requirements","category":"accountability","level":3,"name":"providers customer portfolio","definition":"Description Missing","linkName":"accountability_governance_providersCustomerPortfolio","type":"select","attributes":"0:\"customer running illegal or questionable services\", 2:\"no knowledge about customers\", 10: \"enterprise class customers running B2B services\"","subcategory":"governance"},{"@type":"d","@rid":"#14:11","@version":0,"@class":"Requirements","name":"license costs charged by providers","level":3,"definition":"Description Missing","linkName":"accountability_ownership_licenseCostsChargedByProviders","type":"select","attributes":"0:\"no licensing via provider available\", 5:\"more expensive then direct licensing contracts\", 8:\"same costs as direct licensing contracts\", 10:\"cheaper than direct licensing contracts\"","category":"accountability","subcategory":"ownership"},{"@type":"d","@rid":"#14:12","@version":0,"@class":"Requirements","name":"providers financial stabiity","level":3,"definition":"Description Missing","linkName":"accountability_providerBusinessStability_providerBusinessStability","type":"select","attributes":"0:\"chapter 11 expected\", 1:\"unstable company - insolvency possible\", 5:\"standard stable company - insolvency not expected\", 10:\"very stable company - insolvency rulled out\"","category":"accountability","subcategory":"providerBusinessStability"},{"@type":"d","@rid":"#14:13","@version":0,"@class":"Requirements","name":"information security certificates","level":3,"definition":"Description Missing","linkName":"accountability_providerCertifications_informationSecurityCertificates","type":"select","attributes":"0:\"none\", 5:\"ISO20000\", 10:\"ISO27000-PCI\"","category":"accountability","subcategory":"providerCertifications"},{"@type":"d","@rid":"#14:14","@version":0,"@class":"Requirements","name":"site infrastucture","level":3,"definition":"Description Missing","linkName":"agility_adaptability_siteInfrastucture","type":"radio","attributes":"0:\"no\", 1:\"yes\"","category":"agility","subcategory":"adaptability"},{"@type":"d","@rid":"#14:15","@version":0,"@class":"Requirements","name":"auto scaling","level":3,"definition":"Description Missing","linkName":"agility_elasticity_autoScaling","type":"select","attributes":"0:\"none\", 5:\"basic\", 10:\"sophisticated\"","category":"agility","subcategory":"elasticity"},{"@type":"d","@rid":"#14:16","@version":0,"@class":"Requirements","name":"load balancer","level":3,"definition":"Description Missing","linkName":"agility_elasticity_loadBalancer","type":"select","attributes":"0:\"none\", 5:\"available\", 10:\"available including sticky HTTP session feature\"","category":"agility","subcategory":"elasticity"},{"@type":"d","@rid":"#14:17","@version":0,"@class":"Requirements","name":"relation database replication","level":3,"definition":"Description Missing","linkName":"agility_portability_relationDatabaseReplication","type":"radio","attributes":"0:\"none\", 10:\"available\"","category":"agility","subcategory":"portability"},{"@type":"d","@rid":"#14:18","@version":0,"@class":"Requirements","name":"block storage snapshot","level":3,"definition":"Description Missing","linkName":"agility_portability_blockStoageSnapshot","type":"select","attributes":"0:\"none\", 5:\"available\", 10:\"available and automatically transferred to secondary storage\"","category":"agility","subcategory":"portability"},{"@type":"d","@rid":"#14:19","@version":0,"@class":"Requirements","name":"noSQL database sharding","level":3,"definition":"Description Missing","linkName":"agility_scalability_nosqlDatabaseSharding","type":"select","attributes":"0:\"none\", 3:\"definable on setup\", 6:\"adaptable\", 10:\"self-adapting\"","category":"agility","subcategory":"scalability"}];
    $scope.requirementsSelected = [];
    $scope.requirement = "";
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
