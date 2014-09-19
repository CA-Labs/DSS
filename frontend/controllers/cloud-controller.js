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

    $scope.deploymentsProposals = CloudService.getDeploymentsProposals();

    $scope.servicesSelected = {};
    localStorageService.bind($scope, 'servicesSelected', $scope.servicesSelected);

    $scope.isMulticloudDeployment = AssetsService.getDeploymentType();
    $scope.deploymentsProposals = [];

    //$scope.$watch(function () {
    //    return AssetsService.getDeploymentType();
    //}, function (newVal, oldVal) {
    //    console.log(newVal);
    //    console.log(oldVal);
    //});

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
    $scope.selectService = function (proposal) {
        $scope.servicesSelected = proposal;

        // update xmlTAAsObject
        _.each($scope.xmlTaAsObject.resourceModelExtension.resourceContainer, function (resourceContainer) {
            _.each(proposal, function (proposalItem) {
                console.log('resourceContainer', resourceContainer);
                console.log('proposalItem', proposalItem);
                if (resourceContainer._id == proposalItem.ta._id) {
                    resourceContainer._provider = proposalItem.provider.name;
                        if (_.has(resourceContainer, 'cloudResource')) {
                            resourceContainer.cloudResource._serviceName = proposalItem.service.name;
                        }
                        if (_.has(resourceContainer, 'cloudPlatform')) {
                            resourceContainer.cloudPlatform._serviceName = proposalItem.service.name;
                        }
                }
            });
        });
    };

    /**
     * Is services selected sets the appropriate true value for only those services which are selected per TA
     * @param taAssetId
     * @param serviceId
     * @returns {boolean}
     */
    $scope.isSelected = function (listItem) {
        var bool = 0;
        _.each(listItem, function (item) {
            _.each($scope.servicesSelected, function (selected) {
                if (item.service._id == selected.service._id) {
                    bool++;
                }
            });
        });
        return (bool == $scope.servicesSelected.length);
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
