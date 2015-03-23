/**
 * Created by Jordi Aranda.
 * 18/08/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('cloudController', ['$scope', '$rootScope', '$timeout', 'ArangoDBService', 'TreatmentsService', 'AssetsService', 'RisksService', 'CloudService', 'localStorageService', 'usSpinnerService', function($scope, $rootScope, $timeout, ArangoDBService, TreatmentsService, AssetsService, RisksService, CloudService, localStorageService, usSpinnerService){

    $scope.ta = AssetsService.getTA();                                  // The selected TA assets loaded from the cloud
                                                                        // descriptor xml file

    $scope.proposals = CloudService.getProposals();                     // The cloud service proposals (by TA) offered
                                                                        // by the graph engine
    localStorageService.bind($scope, 'proposals', $scope.proposals);

    $scope.filteredProposals = CloudService.getFilteredProposals();
    localStorageService.bind($scope, 'filteredProposals', $scope.filteredProposals);

    $scope.deploymentsProposals = [];

    $scope.servicesSelected = CloudService.getServicesSelected();
    localStorageService.bind($scope, 'servicesSelected', $scope.servicesSelected);

    $scope.isMulticloudDeployment = function(){
        return AssetsService.getDeploymentType();
    };

    // order setup for the order of cloud providers
    $scope.orderBy = 'overallScore'; // init
    $scope.isOrderBySelected = function (name) {
        return (name == $scope.orderBy);
    };

    /**
     * Generates the final list of deployment proposals offered to the user.
     * @returns {Array}
     */
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
        return $scope.getDeploymentProposals();
    }, function(newVal, oldVal){
        if(newVal.length > 0){
            $rootScope.$broadcast('repeatDone');
        }
    });

    /**
     * Builds up an initial list of proposals whenever the list of TA assets changes.
     */
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
                        CloudService.setTAProposals(ta, data);
                        $timeout(function(){
                            CloudService.scoreProposals(false);
                        }, 100);
                    }
                });
            });
        }
    }, true);

    /**
     * Whenever the TA sliders move, risks mitigation might change and hence, cloud service proposals should recompute
     * (restart scores, etc.)
     */
    $scope.$on('acceptabilityValueChanged', function(){
        if($scope.ta.length > 0){
            _.each($scope.ta, function(ta){
                var serviceType = ta.cloudType == 'IaaS' ? ta.cloudResource._serviceType : ta.cloudPlatform._serviceType;
                ArangoDBService.getProposalsByCloudAndServiceTypes(ta.cloudType, serviceType, function(error, data){
                    if(error){
                        // console.log(error);
                    } else {
                        CloudService.setTAProposals(ta, data);
                    }
                });
            });
        }
    });

    /**
     * Whenever some TA asset is removed, we should remove the proposals computed for it.
     */
    $scope.$on('removeProposalsForTAAsset', function($event, taAssetId){
        CloudService.removeProposals(taAssetId);
    });

    /**
     * Returns the cloud type for a given TA asset.
     * @param taAsset
     * @returns {ServiceModel.schema.cloudType|*|service.cloudType|dataToSend.cloudType|services.cloudType|Document.serviceForm.cloudType}
     */
    $scope.getCloudTypeFromTA = function(taAsset){
        return taAssset.cloudType;
    };

    /**
     * Given a TA asset, returns the list of proposals for it.
     * @param taAssetName The name of the TA asset.
     * @returns {*}
     */
    $scope.getTAProposals = function(taAssetName){
        return CloudService.getTAProposals(taAssetName);
    };

    /**
     * Event triggered whenever some risk slider is moved. In that case,
     * the list of proposals must be filtered again, since the list of
     * unacceptable risks may have changed, and hence, the proposals
     * score might have changed as well.
     * @WARNING: This event triggers too often, just compute the scores
     * when next button is clicked instead (treatments slide).
     */
    /*
    $scope.$on('risksSelectedChanged', function(){
        CloudService.scoreProposals(false);
        $scope.deploymentsProposals = CloudService.getDeploymentsProposals();
    });
    */

    /**
     * Event triggered when the user decided to get proposals by
     * specifying some treatments.
     */
    $scope.$on('getServicesWithTreatments', function(){
        CloudService.scoreProposals(false);
        $scope.deploymentsProposals = CloudService.getDeploymentsProposals();
    });

    /**
     * Event triggered when the user decided to get proposals
     * without specifying any treatment.
     */
    $scope.$on('getServicesWithoutTreatments', function(){
        CloudService.scoreProposals(true);
        $scope.deploymentsProposals = CloudService.getDeploymentsProposals();
    });

    /**
     * Filteres proposals by thresholds, calling the cloud service.
     */
    $scope.filterProposalsByThresholds = function(useRisksTreatmentsMapping){
        CloudService.scoreProposals(useRisksTreatmentsMapping);
    };

    /**
     * Save selected services
     * @param {object} proposal - service object selected by the user
     * @param {object} taAsset - ta asset object to which the proposal is assigned to
     */
    $scope.selectService = function (proposals) {
        // set the service as selected // TEMP solution for M24 review
        proposals.isSelected = !proposals.isSelected;
        CloudService.setServicesSelected(proposals);
        AssetsService.setXmlTaObject(prepareJsonToXml(AssetsService.getXmlTaObject(), proposals));
    };

    // Auxiliar function to prepare services selection JSON object to be converted back to XML model
    var prepareJsonToXml = function(xmlAsJson, proposals){
        // Make a copy of the servicesSelected
        var copy = _.clone(xmlAsJson);

        // Check whether we have only one TA or more
        if(_.isArray(copy.resourceModelExtension.resourceContainer)){
            _.each(copy.resourceModelExtension.resourceContainer, function(resourceContainer, index){
                _.each(proposals, function(proposal){
                   if(resourceContainer._id == proposal.ta._id){
                       copy.resourceModelExtension.resourceContainer[index]._provider = proposal.provider.name;
                       if(_.has(resourceContainer, 'cloudResource')){
                           copy.resourceModelExtension.resourceContainer[index].cloudResource._serviceName = proposal.service.name;
                       } else if(_.has(resourceContainer, 'cloudPlatform')){
                           copy.resourceModelExtension.resourceContainer[index].cloudPlatform._serviceName = proposal.service.name;
                       }
                   }
                });
            });
        }
        else if(_.isObject(copy.resourceModelExtension.resourceContainer)){
            _.each(proposals, function(proposal){
                if(copy.resourceModelExtension.resourceContainer._id == proposal.ta._id){
                    copy.resourceModelExtension.resourceContainer._provider = proposal.provider.name;
                    if(_.has(copy.resourceModelExtension.resourceContainer, 'cloudResource')){
                        copy.resourceModelExtension.resourceContainer.cloudResource._serviceName = proposal.service.name;
                    } else if(_.has(resourceContainer, 'cloudPlatform')){
                        copy.resourceModelExtension.resourceContainer.cloudPlatform._serviceName = proposal.service.name;
                    }
                }
            });
        }
        return copy;
    };

    /**
     * Is services selected sets the appropriate true value for only those services which are selected per TA
     * @param taAssetId
     * @param serviceId
     * @returns {boolean}
     */
    $scope.isSelected = function (listItem) {
        return (!!listItem.isSelected);
    };

    /**
     * Check if the deployment strategy has unmitigated risks or not
     * @param deployment
     * @returns {boolean}
     */
    $scope.hasUnmitigatedRisks = function (deployment) {
        var hasUnmitigatedRisks = false;

        _.each(deployment, function (service) {
            if (service.unacceptableRisks.length != service.mitigatedRisks.length) {
                hasUnmitigatedRisks = true;
            }
        });

        return hasUnmitigatedRisks;

    };

    /**
     * Check if the deployment has the same provider
     * @param deployment
     * @returns {boolean}
     */
    $scope.isVendorLockedIn = function (deployment) {
        var deploymentWithTheSameProvider = false;

        for (var i = 0; i < deployment.length - 1; i++) {
            deploymentWithTheSameProvider = deployment[i].provider._id == deployment[++i].provider._id;
        }

        return deploymentWithTheSameProvider;
    };

    /**
     * Shows hidden details of the cloud service.
     * @param {object} item - service item from the ng-repeat.
     */
    $scope.showHideDetails = function (event, item, index) {
        event.stopPropagation();
        item.showDetails = !item.showDetails;
    };

}]);
