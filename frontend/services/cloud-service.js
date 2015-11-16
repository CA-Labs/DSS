/**
 * Created by Jordi Aranda.
 * 10/09/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('CloudService', ['AssetsService', 'RisksService', 'TreatmentsService', 'localStorageService', 'flash', 'ArangoDBService', function(AssetsService, RisksService, TreatmentsService, localStorageService, flash, ArangoDBService){

    var proposalsFromLocalStorage = localStorageService.get('proposals') || {};
    var proposals = proposalsFromLocalStorage;

    var filteredProposalsFromLocalStorage = localStorageService.get('filteredProposals') || {};
    var filteredProposals = filteredProposalsFromLocalStorage;

    var servicesSelectedFromLocalStorage = localStorageService.get('servicesSelected') || [];
    var servicesSelected = servicesSelectedFromLocalStorage;

    var loadingProposals = false;
    var loadingFilteredProposals = true;
    var specifyTreatmentsPerCloudService = false;

    var deploymentProposals = [];

    // prefetch the migration score values
    var servicesMigrationValues = [];
    ArangoDBService.getServicesMigrationValues(function (err, values) {
        servicesMigrationValues = values;
    });

    /**
     * Returns the list of initial proposals.
     * @returns {*|{}}
     */
    this.getProposals = function(){
        return proposals;
    };

    /**
     * Sets the list of initial proposals loaded
     * from local storage.
     * @param proposalsLoadedFromLocalStorage The
     * initial proposals to be loaded.
     */
    this.setProposals = function(proposalsLoadedFromLocalStorage){
        if(!angular.equals(proposals, proposalsLoadedFromLocalStorage)){
            angular.copy(proposalsLoadedFromLocalStorage, proposals);
        }
        loadingProposals = false;
    };

    /**
     * Sets a flag indicating whether the initial list of proposals is
     * being loaded or not.
     * @param loadingProposalsFromLocalStorage A boolean indicating the
     * proposals list loading state.
     */
    this.loadingProposals = function(loadingProposalsFromLocalStorage){
        loadingProposals = loadingProposalsFromLocalStorage;
    };

    /**
     * Returns true if the list of proposals is still being loaded,
     * false otherwise.
     * @returns {boolean}
     */
    this.isLoadingProposals = function(){
        return loadingProposals;
    };

    /**
     * Removes the proposals for a certain TA asset.
     * @param taAssetId The TA asset id.
     */
    this.removeProposals = function(taAssetId){
        if(proposals[taAssetId]) {
            delete proposals[taAssetId];
        }
        if(filteredProposals[taAssetId]) {
            delete filteredProposals[taAssetId];
        }
    };

    /**
     * Returns array of all possible permutations of the arguments.
     * @returns {Array}
     */
    this.cartesian = function () {
        var r = [], arg = arguments, max = arg.length-1;
        function helper(arr, i) {
            for (var j=0, l=arg[i].length; j<l; j++) {
                var a = arr.slice(0); // clone arr
                a.push(arg[i][j]);
                if (i==max) {
                    r.push(a);
                } else
                    helper(a, i+1);
            }
        }
        helper([], 0);
        return r;
    };

    /**
     * Sets a list of proposals for a given tangible asset.
     * @param ta The TA asset.
     * @param data The list of proposals for TA asset.
     */
    this.setTAProposals = function(ta, data){
        proposals[ta._id] = data;
    };

    /**
     * Returns the list of filtered proposals.
     * @returns {*|{}}
     */
    this.getFilteredProposals = function(){
        return filteredProposals;
    };

    /**
     * Sets the list of filtered proposals loading them
     * from local storage.
     * @param filteredProposalsLoadedFromLocalStorage The
     * list of filtered proposals to be loaded.
     */
    this.setFilteredProposals = function(filteredProposalsLoadedFromLocalStorage){
        if(!angular.equals(filteredProposals, filteredProposalsFromLocalStorage)){
            angular.copy(filteredProposalsLoadedFromLocalStorage, filteredProposals);
        }
        loadingFilteredProposals = false;
    };

    /**
     * Sets a flag indicating whether the list of filtered proposals
     * has been loaded or not.
     * @param loadingFilteredProposalsFromLocalStorage A boolean indicating
     * filtered proposals list loading state.
     */
    this.loadingFilteredProposals = function(loadingFilteredProposalsFromLocalStorage){
        loadingFilteredProposals = loadingFilteredProposalsFromLocalStorage;
    };

    /**
     * Returns true if the list of filtered proposals is still being loaded,
     * false otherwise.
     * @returns {boolean}
     */
    this.isLoadingFilteredProposals = function(){
        return loadingFilteredProposals;
    };

    /**
     * Returns the list of proposals for a TA asset.
     * @param taAssetId The TA asset id.
     * @returns {*}
     */
    this.getTAProposals = function(taAssetId){
        if(filteredProposals[taAssetId]){
            return filteredProposals[taAssetId];
        } else {
            return [];
        }
    };

    /**
     * Given a TA assets list and a TA id, returns
     * the corresponding TA asset.
     * @param taList A list of TA ssets.
     * @param taName The TA asset id..
     * @returns {{}}
     */
    function getTA (taList, taId) {
        var returnTA = {};
        _.each(taList, function (ta) {
            if(ta._id == taId){
                returnTA = ta;
            }
        });
       return returnTA;
    }


    /**
     * Returns the final list of deployment proposals.
     * @returns {Array}
     */
    this.getDeploymentsProposals = function () {

        var taAssets = AssetsService.getTA();

        var argsArray = [];
        if (!_.isEmpty(filteredProposals)) {
            _.each(filteredProposals, function (proposal, taAssetId) {
                // attach ta to proposal
                for (var i = 0; i < proposal.length; i++) {
                    proposal[i].ta = getTA(taAssets, taAssetId);
                }
                argsArray.push(proposal);
            });

            // find deployments combinations
            deploymentProposals = this.cartesian.apply(null, argsArray);

            // calculate overall score
            _.each(deploymentProposals, function(proposal, index) {
                var riskBasedScore = 0;
                var qualitySumScore = 0;
                var minimalDeploymentCost = 0;
                var migrationScore = 0;

                _.each(proposal, function (service, indexP) {

                    var qualityScoreSum = 0;
                    _.each(service.service.qualityVotes, function (vote) {
                        qualityScoreSum += vote.score;
                    });
                    riskBasedScore += service.score/service.total;
                    qualitySumScore += (qualityScoreSum / service.service.qualityVotes.length);
                    console.log(qualitySumScore);
                    minimalDeploymentCost += parseInt(service.service.minimumDeploymentCost.replace(",", ".")) || 0;
                    migrationScore += servicesMigrationValues[service.service._id];

                    deploymentProposals[index][indexP].migrationScore = servicesMigrationValues[service.service._id];
                });

                // calculate riskBasedScore
                deploymentProposals[index].overallScore = riskBasedScore / proposal.length;
                deploymentProposals[index].qualityScore = qualitySumScore / proposal.length;
                deploymentProposals[index].minimalDeploymentCost = minimalDeploymentCost;
                deploymentProposals[index].migrationScore = migrationScore / proposal.length;
            });
            return deploymentProposals;
        }
    };

    /**
     * Scores the cloud service proposals.
     */
    this.scoreProposals = function(useTreatmentsRisksMapping){

        filteredProposals = proposals;
        var treatments = [];
        var tretmentsValues = [];
        var ta = AssetsService.getTA();
        var unacceptableRisksPerTA = RisksService.getUnacceptableRisks();

        _.each(proposals, function(proposalsPerTA, taAssetId){
            var unacceptableRisks = unacceptableRisksPerTA[taAssetId] || [];
            _.each(proposalsPerTA, function(proposal, i){
                filteredProposals[taAssetId][i].unacceptableRisks = unacceptableRisks;
                filteredProposals[taAssetId][i].mitigatedRisks = [];
                filteredProposals[taAssetId][i].unmitigatedRisks = [];
                if(proposal.service.cloudType == AssetsService.getTAById(taAssetId).cloudElement._serviceCategory){
                    // Determine what treatments should be taken into account
                    treatments = proposal.characteristics;
                    treatmentsValues = proposal.characteristics.map(function(c){ return c.value});
                    if (!useTreatmentsRisksMapping) {
                        // Take into account only selected treatments
                        treatments = TreatmentsService.getTreatments();
                    }
                    _.each(treatments, function(treatment, j){

                        var criticityValue = null;
                        var treatmentValue = null;

                        // Special cases:
                        // Place of jurisdiction => comparison between continents/regions arrays
                        if (treatment.name == "Place of jurisdiction"){
                            var placeOfJurisdiction = proposal.characteristics.filter(function(characteristic){return characteristic.name == "Place of jurisdiction"});
                            placeOfJurisdiction = placeOfJurisdiction.length == 1 ? placeOfJurisdiction[0].value : [];
                            criticityValue = TreatmentsService.showTreatmentValue(treatment.name) ?
                                AssetsService.getInverseCriticityValue(TreatmentsService.compareRegions(TreatmentsService.getTreatmentValue(treatment.name), placeOfJurisdiction)) : AssetsService.getInverseCriticityValue(treatment.default);
                            treatmentValue =  AssetsService.getInverseCriticityValue(TreatmentsService.compareRegions(TreatmentsService.getTreatmentValue(treatment.name), placeOfJurisdiction));
                        } else {
                            if (treatment.hasOwnProperty('value')) {
                                criticityValue = TreatmentsService.showTreatmentValue(treatment.name) ?
                                    AssetsService.getInverseCriticityValue(TreatmentsService.getTreatmentValue(treatment.name)) : AssetsService.getInverseCriticityValue(treatment.default);
                                treatmentValue = AssetsService.getInverseCriticityValue(treatment.value);
                            } else {
                                criticityValue = TreatmentsService.showTreatmentValue(treatment.name) ?
                                    AssetsService.getInverseCriticityValue(TreatmentsService.getTreatmentValue(treatment.name)) : AssetsService.getInverseCriticityValue(treatment.default);
                                var proposalCharacteristic = proposal.characteristics.filter(function (t) {
                                    return t.name == treatment.name
                                });
                                if (proposalCharacteristic.length > 0) {
                                    treatmentValue = AssetsService.getInverseCriticityValue(proposalCharacteristic[0].value);
                                } else {
                                    // If the service does not have this characteristic, consider it has it with the
                                    // lowest value possible
                                    treatmentValue = 0;
                                }
                            }
                        }
                        // console.log('Criticity value vs treatment value', criticityValue, treatmentValue);
                        var risksFromTreatment = TreatmentsService.getRisksFromTreatment(treatment.name);
                        _.each(unacceptableRisks, function(unacceptableRisk){
                            if(_.contains(risksFromTreatment, unacceptableRisk) && treatmentValue <= criticityValue){
                                // This treatment is mitigating the risk
                                if(filteredProposals[taAssetId][i].mitigatedRisks.indexOf(unacceptableRisk) == -1){
                                    // console.log('treatment ' + treatment + ' is mitigating risk ' +
                                    // unacceptableRisk);
                                    filteredProposals[taAssetId][i].mitigatedRisks.push(unacceptableRisk);
                                }
                                // Check if this treatment was considered unmitigated before
                                var k = -1;
                                _.each(filteredProposals[taAssetId][i].unmitigatedRisks, function(unmitigatedRisk, l){
                                    if(unmitigatedRisk == unacceptableRisk){
                                        k = l;
                                    }
                                });
                                if(k >= 0){
                                    // console.log('unacceptable risk ' + unacceptableRisk + ' was considered
                                    // unmitigated before');
                                    filteredProposals[taAssetId][i].unmitigatedRisks.splice(k, 1);
                                }
                            } else {
                                // Before considering it unmitigated, check if other treatment mitigated that risk
                                if(filteredProposals[taAssetId][i].mitigatedRisks.indexOf(unacceptableRisk) == -1){
                                    if(filteredProposals[taAssetId][i].unmitigatedRisks.indexOf(unacceptableRisk) == -1){
                                        filteredProposals[taAssetId][i].unmitigatedRisks.push(unacceptableRisk);
                                    }
                                }
                            }
                        });
                    })
                }
            });
        });

        // Normalization
        _.each(filteredProposals, function(proposals, taAssetId){
            _.each(proposals, function(proposal, index){
                filteredProposals[taAssetId][index].score = proposal.unacceptableRisks.length == 0 ? 1 : proposal.mitigatedRisks.length;
                filteredProposals[taAssetId][index].total = proposal.unacceptableRisks.length || 1;
            });
        });

        // console.log('end result', filteredProposals);

    };

    /**
     * Sets the list of services selected from local storage.
     * @param servicesSelectedFromLocalStorage The services selected
     * to be loaded from local storage.
     */
    this.setServicesSelected = function(servicesSelectedFromLocalStorage){
        if(!angular.equals(servicesSelectedFromLocalStorage, servicesSelected)){
            angular.copy(servicesSelectedFromLocalStorage, servicesSelected);
        }
    };

    /**
     * Returns the list of services selected.
     * @returns {*|{}}
     */
    this.getServicesSelected = function(){
        return servicesSelected;
    };

}]);
