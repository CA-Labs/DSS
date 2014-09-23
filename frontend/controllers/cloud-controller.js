/**
 * Created by Jordi Aranda.
 * 18/08/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('cloudController', ['$scope', '$rootScope', '$timeout', 'ArangoDBService', 'TreatmentsService', 'AssetsService', 'RisksService', 'CloudService', 'localStorageService', function($scope, $rootScope, $timeout, ArangoDBService, TreatmentsService, AssetsService, RisksService, CloudService, localStorageService){

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

    $scope.$watch(function () {
        return AssetsService.getDeploymentType();
    }, function (newVal) {
        $scope.isMulticloudDeployment = newVal;
    });

    $scope.$watch(function(){
        return CloudService.getProposals();
    }, function(newVal, oldVal){
        $scope.proposals = newVal;
    }, true);

    $scope.$watch(function(){
        return CloudService.getFilteredProposals();
    }, function(newVal, oldVal){
        $scope.filteredProposals = newVal;
    }, true);

    $scope.$watch(function(){
        return CloudService.getDeploymentsProposals();
    }, function(newVal, oldVal){
        $scope.deploymentsProposals = newVal;
    }, true);

    $scope.getDeploymentProposals = function () {
        var deploymentsProposals = [];
        if ($scope.isMulticloudDeployment) {
            return $scope.deploymentsProposals;
        }

        _.each($scope.deploymentsProposals, function (deployment) {
            var numberOfTaAssets = deployment.length - 1;

            // fall back for case when there is only 1 TA
            if (numberOfTaAssets == 0) {
                return $scope.deploymentsProposals;
            }

            var haveTheSameProvider = 0;
            for (var i = 0; i < numberOfTaAssets; i++) {
                if (deployment[i].provider._id == deployment[i+1].provider._id) {
                    haveTheSameProvider++;
                }
            }

            if (haveTheSameProvider == numberOfTaAssets) deploymentsProposals.push(deployment);
        });

        return deploymentsProposals;
    };

    $scope.$watch(function(){
        return AssetsService.getXmlTaObject();
    }, function(newVal, oldVal){
        $scope.xmlTaAsObject = newVal;          // gets the Object representation of the Modelio loaded XML
    }, true);

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
                        $timeout(function(){
                            CloudService.filterProposalsByTreatments();
                            CloudService.filterProposalsByThresholds();
                        }, 100);
                    }
                });
            });
        }
    }, true);

    $scope.$watch(function(){
        return CloudService.getFilteredProposals();
    }, function(newProposals){
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
    $scope.showHideDetails = function (event, item, index) {
        event.stopPropagation();
        item.showDetails = !item.showDetails;
    };

}]);
