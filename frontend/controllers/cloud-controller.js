/**
 * Created by Jordi Aranda.
 * 18/08/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('cloudController', ['$scope', 'ArangoDBService', 'TreatmentsService', 'AssetsService', 'RisksService', 'localStorageService', function($scope, ArangoDBService, TreatmentsService, AssetsService, RisksService,   localStorageService){

    $scope.treatments = TreatmentsService.getTreatments();              // The selected treatments
    $scope.ta = AssetsService.getTA();                                  // The selected TA assets loaded from the cloud descriptor xml file
    $scope.proposals = {};                                              // The cloud service proposals (by TA) offered by the graph engine
    localStorageService.bind($scope, 'proposals', $scope.proposals);
    $scope.filteredProposals = {};
    localStorageService.bind($scope, 'filteredProposals', $scope.filteredProposals);
    $scope.servicesSelected = {};
    localStorageService.bind($scope, 'servicesSelected', $scope.servicesSelected);
    $scope.xmlTaAsObject = AssetsService.getXmlTaObject();              // gets the Object representation of the Modelio loaded XML

    $scope.$watch(function(){
        return AssetsService.getTA();
    }, function(newTA, oldTA){
        $scope.ta = newTA;
        // Only query service proposals if we have at least one tangible asset
        if($scope.ta.length > 0){
            _.each($scope.ta, function(ta){
                var serviceType = ta.cloudType == 'IaaS' ? ta.cloudResource._serviceType : ta.cloudPlatform._serviceType;
                ArangoDBService.getProposalsByCloudAndServiceTypes(ta.cloudType, serviceType, function(error, data){
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
                });
            });
        }
    }, true);

    $scope.getCloudTypeFromTA = function(taAsset){
        return taAssset.cloudType;
    };

    $scope.getTAProposals = function(taAssetName){
        if($scope.proposals[taAssetName]){
            return $scope.proposals[taAssetName];
        } else {
            return [];
        }
    };

    $scope.$on('risksSelectedChanged', function(){
        $scope.filterProposalsByTreatments($scope.treatments);
        $scope.filterProposalsByThresholds();
        console.log('new filtered', $scope.filteredProposals);
    });

    $scope.filterProposalsByTreatments = function(treatments){
        $scope.filteredProposals = {};
        var treatmentsFound = 0;
        _.each($scope.ta, function(ta){
            var taProposals = [];
            var cloudType = ta.cloudType;
            var taName = '';
            switch(ta.cloudType){
                case 'IaaS':
                    taName = ta.cloudResource._serviceName;
                    break;
                case 'PaaS':
                    taName = ta.cloudPlatform._serviceName;
                    break;
                default:
                    break;
            }
            taProposals = $scope.proposals[taName];
            if(taProposals){
                _.each(taProposals, function(taProposal){
                    treatmentsFound = 0;
                    // Check if this proposal contains all treatments in its path
                    var taProposalCharacteristicNames = taProposal.characteristics.map(function(e){ return e.name });
                    _.each(treatments, function(treatment){
                        if(_.contains(taProposalCharacteristicNames, treatment.name)){
                            treatmentsFound++;
                        }
                    });
                    if(treatmentsFound == treatments.length){
                        if($scope.filteredProposals[taName]){
                            $scope.filteredProposals[taName].push(taProposal);
                        } else {
                            $scope.filteredProposals[taName] = [];
                            $scope.filteredProposals[taName].push(taProposal);
                        }
                    }
                });
            }
        });
    };

//    $scope.filterProposalsByThresholds = function(){
//        var servicesScores = {};
//        _.each($scope.treatments, function(treatment){
//            var treatmentName = treatment.name;
//            console.log('treatmentName', treatmentName);
//            var treatmentRisks = TreatmentsService.getRisksFromTreatment(treatmentName);
//            console.log('treatmentRisks', treatmentRisks);
//            _.each(treatmentRisks, function(riskName){
//                _.each(treatment.taRelations, function(ta){
////                    var lc = RisksService.getThresholdFromRisk(riskName, ta._id);
////                    console.log('lc', lc);
//                    var criticityValue = ta.criticityValue;
//                    console.log('criticityValue', criticityValue);
//                    _.each($scope.filteredProposals, function(proposal){
//                        var characteristics = proposal.characteristics;
//                        _.each(characteristics, function(characteristic){
//                            if(characteristic.name == treatmentName && characteristic.value > criticityValue){
//                                // TODO:OK
//                            }
//                        });
//                    })
//                });
//            });
//        });
//    };

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
                resourceContainer._provider = $scope.servicesSelected[taAsset._id].serviceSelected.provider.name;
                if (resourceContainer.cloudResource) {
                    resourceContainer.cloudResource._serviceName = $scope.servicesSelected[taAsset._id].serviceSelected.service.name;
                } else if (resourceContainer.cloudPlatform) {
                    resourceContainer.cloudPlatform._serviceName = $scope.servicesSelected[taAsset._id].serviceSelected.service.name;
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
