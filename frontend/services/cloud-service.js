/**
 * Created by Jordi Aranda.
 * 10/09/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('CloudService', ['AssetsService', 'RisksService', 'TreatmentsService', 'localStorageService', 'flash', function(AssetsService, RisksService, TreatmentsService, localStorageService, flash){

    var proposalsFromLocalStorage = localStorageService.get('proposals') || {};
    var proposals = proposalsFromLocalStorage;

    var filteredProposalsFromLocalStorage = localStorageService.get('filteredProposals') || {};
    var filteredProposals = filteredProposalsFromLocalStorage;

    var loadingProposals = false;
    var loadingFilteredProposals = true;

    var deploymentProposals = [];

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
                var numerator = 0.0;
                var denominator = 0.0;
                _.each(proposal, function (service) {
                    numerator += service.score;
                    denominator += service.total;
                });

                // calulate overallScore
                deploymentProposals[index].overallScore = (numerator/denominator) || 0.0;
            });
            return deploymentProposals;
        }
    };

    /**
     * Filters a list of proposals by treatments (i.e. for each
     * treatment, exists a path between the proposal and the
     * treatment).
     */
    this.filterProposalsByTreatments = function(){

        var taAssets = AssetsService.getTA();
        var treatments = TreatmentsService.getTreatments();
        // console.log('treatments in treatments filter', treatments);

        filteredProposals = {};
        var treatmentsFound = 0;
        _.each(taAssets, function(ta){
            var taProposals = [];
            var cloudType = ta.cloudType;
            taProposals = proposals[ta._id];
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
                        if(filteredProposals[ta._id]){
                            filteredProposals[ta._id].push(taProposal);
                        } else {
                            filteredProposals[ta._id] = [];
                            filteredProposals[ta._id].push(taProposal);
                        }
                    }
                });
            }
        });

        // console.log('result after filter proposals by treatments', filteredProposals);
        // console.log('treatments', filteredProposals);

    };

    /**
     * Filters a list of proposals by threshold values (TA assets
     * criticity values).
     */
    this.filterProposalsByThresholds = function(){

        var treatments = TreatmentsService.getTreatments();

        /***************************************************************************************
         ***************************************************************************************
         ****** No treatments selected, all unacceptable risks are then unmitigated risks ******
         ***************************************************************************************
         ***************************************************************************************/

        if(treatments.length == 0){
            var unmitigatedRisks = [];
            var risksSelected = RisksService.getRisks();
            var unacceptableRisksPerTA = RisksService.getUnacceptableRisks();
            _.each(unacceptableRisksPerTA, function(risks, ta){
                _.each(risks, function(risk){
                    if(unmitigatedRisks.indexOf(risk) == -1){
                        unmitigatedRisks.push(risk);
                    }
                });
            });
            _.each(filteredProposals, function(proposals, taAssetId){
                _.each(proposals, function(proposal, index){
                    filteredProposals[taAssetId][index].unmitigatedRisks = unmitigatedRisks;
                    // If all risks are acceptable (i.e. there are no unacceptable risks), all services should have a score of 10
                    if(unmitigatedRisks.length == 0){
                        // Simulate a score of 10, i.e. score and total are equal
                        filteredProposals[taAssetId][index].score = 1;
                        filteredProposals[taAssetId][index].total = 1;
                    } else {
                        // flash.error = 'This should\'t occur since we don\'t allow having unacceptable risks without treatments for simplicity';
                        // console.error('There unacceptable risks and no treatment has been selected yet!');
                    }
                });
            });
            return;
        } else {

            /***************************************************************************************
             ***************************************************************************************
             *************************** Some treatments were selected *****************************
             ***************************************************************************************
             ***************************************************************************************/

            // Reset scores
            _.each(filteredProposals, function(proposals, taAssetId){
                _.each(proposals, function(proposal, index){
                    filteredProposals[taAssetId][index].score = 0.0;
                    filteredProposals[taAssetId][index].total = 0.0;
                    filteredProposals[taAssetId][index].unmitigatedRisks = [];
                    filteredProposals[taAssetId][index].riskMitigatedNames = [];
                });
            });

            _.each(RisksService.getUnacceptableRisks(), function(unacceptableRisksPerTA, taAssetId){
                _.each(unacceptableRisksPerTA, function(unacceptableRisk){
                    _.each(treatments, function(treatment){
                        var treatmentName = treatment.name;
                        _.each(treatment.taRelations, function(ta){
                            if(ta._id == taAssetId){
                                // Retrieve criticity value to take into account. If treatment value is selected,
                                // that's the criticity value to take into account. If not, take the TA asset
                                // importance as the criticity value.
                                var criticityValue = TreatmentsService.showTreatmentValue(treatmentName) ? AssetsService.getInverseCriticityValue(TreatmentsService.getTreatmentValue(treatmentName)) : AssetsService.getTACriticityValue(ta._id);
                                // Check if this treatment is mitigating the current unacceptable risk
                                _.each(filteredProposals, function(proposals, taId){
                                    if(taId == taAssetId){
                                        _.each(proposals, function(proposal, index){
                                            if(!filteredProposals[taAssetId][index].riskMitigatedNames){
                                                filteredProposals[taAssetId][index].riskMitigatedNames = [];
                                            }
                                            if(proposal.service.cloudType == ta.cloudType){
                                                // console.log('Evaluating service ' + proposal.service.name + ' (index=' + index + ') for TA asset ' + ta._id + ' and unacceptable risk ' + unacceptableRisk);
                                                // console.log('The criticity value to take into account is ' + criticityValue);
                                                var riskMitigated = false;
                                                _.each(proposal.characteristics, function(characteristic){
                                                    // console.log('Current characteristic is ' + characteristic.name + ' with value ' + AssetsService.getInverseCriticityValue(characteristic.value) + ', comparting to treatment ' + treatmentName);
                                                    if(characteristic.name == treatmentName && AssetsService.getInverseCriticityValue(characteristic.value) <= criticityValue && !riskMitigated){
                                                        // This characteristic is mitigating the risk for that TA and service proposal
                                                        riskMitigated = true;
                                                        if(filteredProposals[taAssetId][index].riskMitigatedNames.indexOf(unacceptableRisk) == -1){
                                                            filteredProposals[taAssetId][index].riskMitigatedNames.push(unacceptableRisk);
                                                            if(filteredProposals[taAssetId][index].score){
                                                                // console.log(characteristic.name + ' is mitigating risk ' + unacceptableRisk + ' in service ' + proposal.service.name + ' and asset ' + taAssetId + ' and proposal number ' + index);
                                                                filteredProposals[taAssetId][index].score++;
                                                            } else {
                                                                // console.log(characteristic.name + ' is mitigating risk ' + unacceptableRisk + ' in service ' + proposal.service.name + ' and asset ' + taAssetId + ' and proposal number ' + index);
                                                                filteredProposals[taAssetId][index].score = 1.0;
                                                            }
                                                        }
                                                    }
                                                });
                                                 if(!riskMitigated){
                                                    // console.log(unacceptableRisk + ' is not mitigated for service ' + proposal.service.name + ' and TA asset ' + ta._id);
                                                    // Store what risks are unmitigated for that service
                                                    if(filteredProposals[taAssetId][index].unmitigatedRisks){
                                                        if(filteredProposals[taAssetId][index].unmitigatedRisks.indexOf(unacceptableRisk) == -1){
                                                            filteredProposals[taAssetId][index].unmitigatedRisks.push(unacceptableRisk);
                                                        }
                                                    } else {
                                                        filteredProposals[taAssetId][index].unmitigatedRisks = [];
                                                        if(filteredProposals[taAssetId][index].unmitigatedRisks.indexOf(unacceptableRisk) == -1){
                                                            filteredProposals[taAssetId][index].unmitigatedRisks.push(unacceptableRisk);
                                                        }
                                                    }
                                                 }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                });
            });


            // Normalization
            _.each(filteredProposals, function(proposals, taAssetId){
                _.each(proposals, function(proposal, index){
                    if(_.isNumber(proposal.score)){
                        // We had unacceptable risks and none has been mitigated, simulate a score of 0
                        if(filteredProposals[taAssetId][index].riskMitigatedNames.length == 0){
                            filteredProposals[taAssetId][index].score = 0.0;
                            filteredProposals[taAssetId][index].total = filteredProposals[taAssetId][index].unmitigatedRisks.length;
                        } else {
                            filteredProposals[taAssetId][index].total = filteredProposals[taAssetId][index].riskMitigatedNames.length + filteredProposals[taAssetId][index].unmitigatedRisks.length;
                        }
                    } else {
                        // Same case as above
                        filteredProposals[taAssetId][index].score = 0.0;
                        filteredProposals[taAssetId][index].total = filteredProposals[taAssetId][index].riskMitigatedNames.length + filteredProposals[taAssetId][index].unmitigatedRisks.length;
                    }
                });
            });

        }

    };

}]);
