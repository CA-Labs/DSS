/**
 * Created by Jordi Aranda.
 * 18/08/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('cloudController', ['$scope', 'ArangoDBService', 'TreatmentsService', 'AssetsService', 'RisksService', 'CloudService', 'localStorageService', function($scope, ArangoDBService, TreatmentsService, AssetsService, RisksService, CloudService, localStorageService){

    $scope.ta = AssetsService.getTA();                                  // The selected TA assets loaded from the cloud descriptor xml file

    $scope.proposals = CloudService.getProposals();                     // The cloud service proposals (by TA) offered by the graph engine
    localStorageService.bind($scope, 'proposals', $scope.proposals);

    $scope.filteredProposals = CloudService.getFilteredProposals();
    localStorageService.bind($scope, 'filteredProposals', $scope.filteredProposals);

    $scope.servicesSelected = {};

    $scope.deploymentsProposals = [];

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
                        // console.log(error);
                    } else {
                        // console.log(data._documents);
                        CloudService.setTAProposals(ta, data._documents);
                    }
                });
            });
        }
    }, true);

    $scope.$watch(function(){
        return CloudService.getFilteredProposals();
    }, function(newProposals){
        console.log(newProposals);
        $scope.filteredProposals = newProposals;
    }, true);

    $scope.getCloudTypeFromTA = function(taAsset){
        return taAssset.cloudType;
    };

    $scope.getTAProposals = function(taAssetName){
        return CloudService.getTAProposals(taAssetName);
    };

    $scope.$on('risksSelectedChanged', function(){
        CloudService.filterProposalsByTreatments();
        CloudService.filterProposalsByThresholds();
        $scope.deploymentsProposals = CloudService.getDeploymentsProposals();
    });

    $scope.filterProposalsByTreatments = function(){
        CloudService.filterProposalsByTreatments();
    };

    $scope.filterProposalsByThresholds = function(){
        CloudService.filterProposalsByThresholds();
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

    /**
     * Show hide details of the cloud service
     * @param {object} item - service item from the ng-repeat
     */
    $scope.showHideDetails = function (event, item) {
        event.stopPropagation();
        item.showDetails = !item.showDetails;
    };

}]);
