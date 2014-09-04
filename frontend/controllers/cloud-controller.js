/**
 * Created by Jordi Aranda.
 * 18/08/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('cloudController', ['$scope', 'ArangoDBService', 'TreatmentsService', 'AssetsService', 'localStorageService', function($scope, ArangoDBService, TreatmentsService, AssetsService, localStorageService){

    $scope.treatments = TreatmentsService.getTreatments();              // The selected treatments
    $scope.ta = AssetsService.getTA();                                  // The selected TA assets loaded from the cloud descriptor xml file
    $scope.proposals = {};                                              // The cloud service proposals (by TA) offered by the graph engine
    localStorageService.bind($scope, 'proposals', $scope.proposals);
    $scope.servicesSelected = {};
    localStorageService.bind($scope, 'servicesSelected', $scope.servicesSelected);
    $scope.xmlTaAsObject = AssetsService.getXmlTaObject();              // gets the Object representation of the Modelio loaded XML

    $scope.$watch(function(){
        return TreatmentsService.getTreatments();
    }, function(newTreatments, oldTreatments){
        $scope.treatments = newTreatments;

        // Only query service proposals if we have at least one treatment and tangible asset
        if($scope.treatments.length > 0 && $scope.ta.length > 0){
            _.each($scope.ta, function(ta){
                ArangoDBService.getProposals(ta.cloudType, $scope.treatments, function(error, data){
                    if(error){
                        console.log(error);
                    } else {
                        console.log(data);
                        switch(ta.cloudType){
                            case 'IaaS':
                                $scope.proposals[ta.cloudResource._serviceName] = data._documents;
                                break;
                            case 'PaaS':
                                $scope.proposals[ta.cloudPlatform._serviceName] = data._documents;
                                break;
                            default:
                                break;
                        }
                    }
                    console.log($scope.proposals);
                });
            });
        } else {
            $scope.proposals = [];
        }
    }, true);

    $scope.$watch(function(){
        return AssetsService.getTA();
    }, function(newTA, oldTA){
        $scope.ta = newTA;
        // Only query service proposals if we have at least one treatment and tangible asset
        if($scope.ta.length > 0 && $scope.treatments.length > 0){
            _.each($scope.ta, function(ta){
                ArangoDBService.getProposals(ta.cloudType, $scope.treatments, function(error, data){
                    if(error){
                        console.log(error);
                    } else {
                        switch(ta.cloudType){
                            case 'IaaS':
                                $scope.proposals[ta.cloudResource._serviceName] = data._documents;
                                break;
                            case 'PaaS':
                                $scope.proposals[ta.cloudPlatform._serviceName] = data._documents;
                                break;
                            default:
                                break;
                        }
                    }
                    console.log($scope.proposals);
                });
            });
        }
    }, true);

    $scope.getCloudTypeFromTA = function(taAsset){
        return taAssset.cloudType;
    };

    $scope.getTAProposals = function(taAssetName){
        // console.log('getting proposals for TA ' + taAssetName);
        if($scope.proposals[taAssetName]){
            console.log($scope.proposals[taAssetName]);
            return $scope.proposals[taAssetName];
        } else {
            return [];
        }
    };

    /**
     * Save selected services
     * @param {object} proposal - service object selected by the user
     * @param {object} taAsset - ta asset object to which the proposal is assigned to
     */
    $scope.selectService = function (proposal, taAsset) {
        var data = {
            ta: taAsset,
            serviceSelected: proposal
        };
        $scope.servicesSelected[taAsset._id] = data;
        console.log('xml', $scope.xmlTaAsObject.resourceModelExtension.resourceContainer, 'services', $scope.servicesSelected[taAsset._id].serviceSelected.service.name);
        _.each($scope.xmlTaAsObject.resourceModelExtension.resourceContainer, function (resourceContainer) {
            if (resourceContainer._id == taAsset._id) {
                resourceContainer.provider = $scope.servicesSelected[taAsset._id].serviceSelected.provider.name;
                if (resourceContainer.cloudResource) {
                    resourceContainer.cloudResource.serviceName = $scope.servicesSelected[taAsset._id].serviceSelected.service.name;
                } else if (resourceContainer.cloudPlatform) {
                    resourceContainer.cloudPlatform.serviceName = $scope.servicesSelected[taAsset._id].serviceSelected.service.name;
                }
            }
        });
    };

    /**
     * Is services selected sets the appropriate true value for only those services which are selected per TA
     * @param taAssetId
     * @param serviceId
     * @returns {boolean}
     */
    $scope.isSelected = function (taAssetId, serviceId) {
        var bool = false;
        if (_.has($scope.servicesSelected, taAssetId) && $scope.servicesSelected[taAssetId].serviceSelected.service._id == serviceId) {
            bool = true;
        }
        return bool;
    };

}]);
